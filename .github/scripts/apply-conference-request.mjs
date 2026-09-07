import { readFile, writeFile } from 'node:fs/promises';
import { applyConferenceRequest, parseConferenceRequest } from './conference-request-core.mjs';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error('GITHUB_EVENT_PATH is not set.');

const event = JSON.parse(await readFile(eventPath, 'utf8'));
if (event.issue?.title !== '[Conference schedule] Update request') {
  throw new Error('The Issue title does not identify a conference update request.');
}

const request = parseConferenceRequest(event.issue?.body);
const dataPath = new URL('../../assets/data/sysvenues.json', import.meta.url);
const currentData = JSON.parse(await readFile(dataPath, 'utf8'));
const snapshot = new Date().toISOString().slice(0, 10);
const nextData = applyConferenceRequest(currentData, request, snapshot);

await writeFile(dataPath, `${JSON.stringify(nextData, null, 2)}\n`, 'utf8');
console.log(`Validated and applied ${request.changes.length} conference change(s).`);
