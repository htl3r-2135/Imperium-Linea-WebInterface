export function formatMs(ms: number): string {
	const hours        = Math.floor(ms / 3600000);
	const minutes      = Math.floor((ms % 3600000) / 60000);
	const seconds      = Math.floor((ms % 60000) / 1000);
	const milliseconds = ms % 1000;

	if (hours > 0) {
		return `${hours}h ${minutes}m ${seconds}.${String(milliseconds).padStart(3, "0")}s`;
	}
	if (minutes > 0) {
		return `${minutes}m ${seconds}.${String(milliseconds).padStart(3, "0")}s`;
	}
	if (seconds > 0) {
		return `${seconds}.${String(milliseconds).padStart(3, "0")}s`;
	}
	return `${milliseconds}ms`;
}