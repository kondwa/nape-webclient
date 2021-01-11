export const defaultSettings = Object.assign(
    {
        Anchor: [
            "Top",
            [0.125, 0, 0, 0],
            [0.25, 0, 0, 0],
            [0.375, 0, 0, 0],
            [0.625, 0, 0, 0],
            [0.75, 0, 0, 0],
            [0.875, 0, 0, 0],
            "Bottom",
            [0.125, 1, 0, 0],
            [0.25, 1, 0, 0],
            [0.375, 1, 0, 0],
            [0.625, 1, 0, 0],
            [0.75, 1, 0, 0],
            [0.875, 1, 0, 0],
            "Right",
            [1, 0, 0, 0],
            [1, 0.25, 0, 0],
            [1, 0.75, 0, 0],
            [1, 1, 0, 0],
            "Left",
            [0, 0, 0, 0],
            [0, 0.25, 0, 0],
            [0, 0.75, 0, 0],
            [0, 1, 0, 0],
        ],
        ConnectionOverlays: [
            [
                "Arrow",
                {
                    foldback: 1,
                    id: "arrow",
                    length: 10,
                    location: 1,
                    width: 10
                }
            ]
        ],
        Connector: [
            "StateMachine", // Bezier | Straight | Flowchart | StateMachine
            {
                curviness: 1
            }
        ],
        Endpoint: "Dot",
        EndpointStyle: {
            radius: 5
        },
        EndpointHoverStyle: {
            fill: "#f9a825",
            WebkitTransition: "background-color 0.25s ease-in",
            MozTransition: "background-color 0.25s ease-in",
            transition: "background-color 0.25s ease-in"
        },
        HoverPaintStyle: {
            strokeWidth: 5,
            stroke: "#f9a825",
            cursor: "pointer",
            WebkitTransition: "background-color 0.25s ease-in",
            MozTransition: "background-color 0.25s ease-in",
            transition: "background-color 0.25s ease-in"
        },
        PaintStyle: {
            strokeWidth: 3,
            stroke: "#577a9b"
        },
        ReattachConnections: true
    }
);
