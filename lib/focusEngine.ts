export interface FocusMetrics {
    switchCount: number;
    taxMinutes: number;
    fragmentationScore: number;
    status: 'Deep Focus' | 'Distracted' | 'Fragmented' | 'Chaos';
    statusColor: string;
}

/**
 * Calculates the "Context Switching Tax" based on the number of switches.
 * Rule: Each switch costs ~20 minutes of mental recovery (hypothetically).
 * Score: Starts at 100. Each switch deducts 5 points.
 */
export function calculateFocusMetrics(switchCount: number): FocusMetrics {
    const taxMinutes = switchCount * 20; // 20 mins per switch
    const fragmentationScore = Math.max(0, 100 - (switchCount * 5)); // 20 switches = 0 score

    let status: FocusMetrics['status'] = 'Deep Focus';
    let statusColor = '#10b981'; // Emerald-500

    if (fragmentationScore < 90) {
        status = 'Distracted';
        statusColor = '#facc15'; // Yellow-400
    }
    if (fragmentationScore < 70) {
        status = 'Fragmented';
        statusColor = '#f97316'; // Orange-500
    }
    if (fragmentationScore < 50) {
        status = 'Chaos';
        statusColor = '#ef4444'; // Red-500
    }

    return {
        switchCount,
        taxMinutes,
        fragmentationScore,
        status,
        statusColor
    };
}
