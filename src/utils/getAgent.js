const url = new URL(window.location.href);
export const origin = url.origin;
export const pathname = url.pathname;
export const isLocal = origin.split("//")[1].split(":")[0] === "localhost";
// let agentName
// export const agentName = isLocal
//   ? 'ken222'
//   : origin.split('-')[0].split('//')[1].split('.')[0]
const isTest = url.protocol === "http:";
let agentac;
if (isTest) {
  agentac = url.searchParams.get("agent");
} else {
  agentac = origin.split("-")[0].split("//")[1].split(".")[0];
}

export { agentac };
