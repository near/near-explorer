export default function(arr: [number]): string {
  return arr.map(n => n.toString(16).padStart(2, "0")).join("");
}
