"use client";

import { useEffect, useState } from "react";

const Health = () => {
    const [data, setData] = useState<string>("loading...");
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return JSON.stringify(data);
};

export default Health;
