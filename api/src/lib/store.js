// Storage layer = our mini "CDP" database.
// - Locally (no env var): keeps everything in memory, zero setup.
// - In Azure: set COSMOS_CONNECTION_STRING and it uses Cosmos DB (free tier).

const memory = { profiles: new Map(), events: [] };
let cosmos = null;

async function containers() {
  if (!process.env.COSMOS_CONNECTION_STRING) return null;
  if (cosmos) return cosmos;
  const { CosmosClient } = require('@azure/cosmos');
  const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
  const { database } = await client.databases.createIfNotExists({ id: 'learning' });
  const { container: profiles } = await database.containers.createIfNotExists({ id: 'profiles', partitionKey: '/id' });
  const { container: events } = await database.containers.createIfNotExists({ id: 'events', partitionKey: '/visitorId' });
  cosmos = { profiles, events };
  return cosmos;
}

async function getProfile(id) {
  const c = await containers();
  if (!c) return memory.profiles.get(id) || null;
  const { resource } = await c.profiles.item(id, id).read().catch(() => ({ resource: null }));
  return resource || null;
}

async function saveProfile(profile) {
  const c = await containers();
  if (!c) return memory.profiles.set(profile.id, profile);
  await c.profiles.items.upsert(profile);
}

async function allProfiles() {
  const c = await containers();
  if (!c) return [...memory.profiles.values()];
  const { resources } = await c.profiles.items.query('SELECT * FROM c').fetchAll();
  return resources;
}

async function addEvent(event) {
  const c = await containers();
  if (!c) return memory.events.push(event);
  await c.events.items.create(event);
}

async function reset() {
  const c = await containers();
  if (!c) {
    memory.profiles.clear();
    memory.events.length = 0;
    return;
  }
  for (const p of await allProfiles()) await c.profiles.item(p.id, p.id).delete();
  const { resources } = await c.events.items.query('SELECT c.id, c.visitorId FROM c').fetchAll();
  for (const e of resources) await c.events.item(e.id, e.visitorId).delete();
}

module.exports = { getProfile, saveProfile, allProfiles, addEvent, reset, mode: () => (process.env.COSMOS_CONNECTION_STRING ? 'cosmos' : 'memory') };
