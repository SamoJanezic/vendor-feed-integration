class BaseAttributes {
	// Normalize keys: lowercase all except first letter
	static normalizeAttributes(attrs) {
		if (!attrs) return {};
		if (Array.isArray(attrs)) return attrs; // Eventus keeps array structure

		const normalized = {};
		Object.entries(attrs).forEach(([key, value]) => {
			const normKey =
				key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
			normalized[normKey] =
				typeof value === "string" ? value.trim() : value;
		});
		return normalized;
	}

	static extractCapacity(text) {
		if (!text) return text;
		const match = text.match(/(\d+)\s?(GB|TB|MB|ml)/i);
		return match ? `${match[1]} ${match[2].toUpperCase()}` : text.trim();
	}

	static extractScreenSize(text) {
		if (!text) return text;
		const match = text.match(/^\d+(\.\d+)?/);
		return match ? `${match[0]}"` : text.trim();
	}

	static extractResolution(text) {
		if (!text) return text;
		const match = text.match(/\b\d{3,4}\s?x\s?\d{3,4}\b/i);
		return match ? match[0].replace(/\s?x\s?/i, " x ") : text.trim();
	}

	static replaceVat(text) {
        return text.replace(/\b(vatov?|wattov?|watt|vat|w)\b/gi, 'W').replace(/\s+W/, ' W').trim();
    }

    static normalizeGpu(text) {
        if (!text || typeof text !== "string") return text;
        let str = text.toLowerCase().trim();

        // Remove noise
        str = str
            .replace(/\(uma\)/g, "")
            .replace(/video pomnilnik.*$/g, "")
            .replace(/v skupni rabi.*$/g, "")
            .replace(/integrirana|integrated|grafični|grafika|grafična|video/g, "")
            .replace(/skupni.*$/g, "")
            .replace(/- do.*$/g, "")
            .replace(/\s+/g, " ") // collapse spaces
            .trim();

        // AMD Radeon — extract model numbers like 660M, 780M, 860M, 680M
        if (str.includes("amd") || str.includes("radeon")) {
            const model = str.match(/\b\d{3,4}m\b/i); // 660M, 780M ...
            return model ? `AMD Radeon ${model[0].toUpperCase()}` : "AMD Radeon";
        }

        // Intel Iris Xe
        if (str.includes("iris")) {
            return "Intel Iris Xe";
        }

        // Intel Arc
        if (str.includes("arc")) {
            const model = str.match(/\b\d+[a-z]?\b/i); // 140V
            return model ? `Intel Arc ${model[0].toUpperCase()}` : "Intel Arc";
        }

        // Intel UHD — detect numeric versions like 770
        if (str.includes("uhd")) {
            const num = str.match(/\b\d{3,4}\b/); // 770, 730, etc.
            return num ? `Intel UHD ${num[0]}` : "Intel UHD";
        }

        // Intel Graphics — fallback for vague entries
        if (str.includes("intel")) {
            return "Intel Graphics";
        }

        // Generic "Graphics"
        if (str === "graphics" || str === "grafika") {
            return "Unknown GPU";
        }

        return text;
    }
}

export default BaseAttributes;