// @generated
// Automatically generated. Don't change this file manually.

export type NearEcosystemEntitiesId = string & {
  " __flavor"?: "near_ecosystem_entities";
};

export default interface NearEcosystemEntities {
  /** Primary key. Index: near_ecosystem_entities_pkey */
  slug: NearEcosystemEntitiesId;

  title: string | null;

  oneliner: string | null;

  website: string | null;

  category: string | null;

  status: string | null;

  contract: string | null;

  logo: string | null;

  is_app: boolean | null;

  is_nft: boolean | null;

  is_guild: boolean | null;

  is_defi: boolean | null;

  is_dao: boolean | null;
}

export interface NearEcosystemEntitiesInitializer {
  /** Primary key. Index: near_ecosystem_entities_pkey */
  slug: NearEcosystemEntitiesId;

  title?: string | null;

  oneliner?: string | null;

  website?: string | null;

  category?: string | null;

  status?: string | null;

  contract?: string | null;

  logo?: string | null;

  is_app?: boolean | null;

  is_nft?: boolean | null;

  is_guild?: boolean | null;

  is_defi?: boolean | null;

  is_dao?: boolean | null;
}
