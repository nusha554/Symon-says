
// gets miliseconds, waits this ampunt of time, then returns a promise
export default function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}