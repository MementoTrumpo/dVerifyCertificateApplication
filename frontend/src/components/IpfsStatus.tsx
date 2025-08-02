import { useEffect, useState } from "react";

export default function IpfsStatus() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/v0/version", {
                    method: "POST" // ✅ вместо GET
                });
                if (!res.ok) throw new Error("Bad response");
                setIsOnline(true);
            } catch {
                setIsOnline(false);
            }
        };

        checkConnection();

        // Автообновление каждую минуту (опционально)
        const interval = setInterval(checkConnection, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-2 text-sm text-gray-600">
            {isOnline === null && <span>🔄 Проверка IPFS...</span>}
            {isOnline === true && <span className="text-green-600">🟢 IPFS подключён</span>}
            {isOnline === false && <span className="text-red-600">🔴 IPFS недоступен</span>}
        </div>
    );
}
