export async function onRequestGet() {
  return new Response("<h1>Roof Report PDF Placeholder</h1>", {
    headers: { "Content-Type": "text/html" }
  });
}
