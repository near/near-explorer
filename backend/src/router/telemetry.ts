import geoip from "geoip-lite";
import * as trpc from "@trpc/server";

import { Context } from "../context";
import { validators } from "./validators";
import { extraPool, telemetryWriteDatabase } from "../database/databases";

export const router = trpc.router<Context>().mutation("upsert", {
  input: validators.telemetryRequest,
  resolve: async ({ input: nodeInfo }) => {
    if (!nodeInfo.hasOwnProperty("agent")) {
      // This seems to be an old format, and all our nodes should support the new
      // Telemetry format as of 2020-04-14, so we just ignore those old Telemetry
      // reports.
      return;
    }

    const geo = geoip.lookup(nodeInfo.ipAddress);
    if (!telemetryWriteDatabase) {
      return;
    }
    const query = telemetryWriteDatabase
      .insertInto("nodes")
      .values({
        node_id: nodeInfo.chain.node_id,
        ip_address: nodeInfo.ipAddress,
        // moniker has never been really used or implemented on nearcore side
        moniker: nodeInfo.chain.account_id || "",
        // accountId must be non-empty when the telemetry is submitted by validation nodes
        account_id: nodeInfo.chain.account_id || "",
        last_seen: new Date(),
        last_height: nodeInfo.chain.latest_block_height.toString(),
        agent_name: nodeInfo.agent.name,
        agent_version: nodeInfo.agent.version,
        agent_build: nodeInfo.agent.build,
        peer_count: nodeInfo.chain.num_peers.toString(),
        is_validator: nodeInfo.chain.is_validator,
        last_hash: nodeInfo.chain.latest_block_hash,
        signature: nodeInfo.signature || "",
        status: nodeInfo.chain.status,
        latitude: geo ? geo.ll[0].toString() : null,
        longitude: geo ? geo.ll[1].toString() : null,
        city: geo ? geo.city : null,

        bandwidth_download: nodeInfo.system.bandwidth_download,
        bandwidth_upload: nodeInfo.system.bandwidth_upload,
        cpu_usage: nodeInfo.system.cpu_usage,
        memory_usage: nodeInfo.system.memory_usage.toString(),
        boot_time_seconds: nodeInfo.system.boot_time_seconds
          ? new Date(nodeInfo.system.boot_time_seconds * 1000)
          : null,

        block_production_tracking_delay:
          nodeInfo.chain.block_production_tracking_delay,
        min_block_production_delay: nodeInfo.chain.min_block_production_delay,
        max_block_production_delay: nodeInfo.chain.max_block_production_delay,
        max_block_wait_delay: nodeInfo.chain.max_block_wait_delay,
      })
      .onConflict((oc) =>
        oc.column("node_id").doUpdateSet({
          ip_address: (eb) => eb.ref("excluded.ip_address"),
          moniker: (eb) => eb.ref("excluded.moniker"),
          account_id: (eb) => eb.ref("excluded.account_id"),
          last_seen: (eb) => eb.ref("excluded.last_seen"),
          last_height: (eb) => eb.ref("excluded.last_height"),
          agent_name: (eb) => eb.ref("excluded.agent_name"),
          agent_version: (eb) => eb.ref("excluded.agent_version"),
          agent_build: (eb) => eb.ref("excluded.agent_build"),
          peer_count: (eb) => eb.ref("excluded.peer_count"),
          is_validator: (eb) => eb.ref("excluded.is_validator"),
          last_hash: (eb) => eb.ref("excluded.last_hash"),
          signature: (eb) => eb.ref("excluded.signature"),
          status: (eb) => eb.ref("excluded.status"),
          latitude: (eb) => eb.ref("excluded.latitude"),
          longitude: (eb) => eb.ref("excluded.longitude"),
          city: (eb) => eb.ref("excluded.city"),

          bandwidth_download: (eb) => eb.ref("excluded.bandwidth_download"),
          bandwidth_upload: (eb) => eb.ref("excluded.bandwidth_upload"),
          cpu_usage: (eb) => eb.ref("excluded.cpu_usage"),
          memory_usage: (eb) => eb.ref("excluded.memory_usage"),
          boot_time_seconds: (eb) => eb.ref("excluded.boot_time_seconds"),

          block_production_tracking_delay: (eb) =>
            eb.ref("excluded.block_production_tracking_delay"),
          min_block_production_delay: (eb) =>
            eb.ref("excluded.min_block_production_delay"),
          max_block_production_delay: (eb) =>
            eb.ref("excluded.max_block_production_delay"),
          max_block_wait_delay: (eb) => eb.ref("excluded.max_block_wait_delay"),
        })
      );

    const compiled = query.compile();
    // TODO: figure out why raw query run faster than kysely query
    await extraPool.query(compiled.sql, compiled.parameters as any);
  },
});
