import type { Game37State } from "../types/Game37State";
import type { Game37Action } from "../types/Game37Action";

import { chooseBotAction } from "../bot";

import { dispatchGame37Action } from "../engine/dispatch";

export function runBotMatchVerbose(
    initialState: Game37State,
    maxIterations = 10000
): Game37State {
    let state = initialState;

    let iteration = 0;

    console.log("=== BOT MATCH START ===");

    while (
        state.phase !== "match_end" &&
        iteration < maxIterations
    ) {
        iteration++;

        console.log("");
        console.log(`--- ITERATION ${iteration} ---`);
        console.log(`PHASE: ${state.phase}`);
        console.log(`CURRENT PLAYER: ${state.currentPlayerId}`);

        if (state.phase === "round_setup") {
            console.log("AUTO ACTION: start_round");

            state = dispatchGame37Action(state, {
                type: "start_round",
            });

            continue;
        }

        if (state.phase === "trick_resolution") {
            console.log("AUTO ACTION: resolve_trick");

            state = dispatchGame37Action(state, {
                type: "resolve_trick",
            });

            continue;
        }

        if (state.phase === "round_scoring") {
            console.log("AUTO ACTION: score_round");

            state = dispatchGame37Action(state, {
                type: "score_round",
            });

            continue;
        }

        if (state.phase === "round_transition") {
            console.log("AUTO ACTION: next_round");

            state = dispatchGame37Action(state, {
                type: "next_round",
            });

            continue;
        }

        const currentPlayerId =
            state.currentPlayerId;

        if (!currentPlayerId) {
            console.log("No current player.");
            break;
        }

        const player = state.players.find(
            (entry) => entry.id === currentPlayerId
        );

        if (!player) {
            console.log("Player not found.");
            break;
        }

        if (!player.isBot) {
            console.log("Human player reached.");
            break;
        }

        const decision = chooseBotAction(
            state,
            currentPlayerId
        );

        console.log("BOT DECISION:", decision);

        let action: Game37Action | null = null;

        if (decision.type === "play_card") {
            action = {
                type: "play_card",
                playerId: currentPlayerId,
                payload: {
                    cardId: decision.card.id,
                },
            };
        }

        if (decision.type === "draw_card") {
            action = {
                type: "draw_card",
                playerId: currentPlayerId,
            };
        }

        if (!action) {
            console.log("No executable action.");
            break;
        }

        console.log("ACTION:", action);

        state = dispatchGame37Action(state, action);

        console.log(
            "EVENTS:",
            state.eventQueue.map((event) => event.type)
        );
    }

    console.log("");
    console.log("=== BOT MATCH END ===");
    console.log("FINAL PHASE:", state.phase);
    console.log("ITERATIONS:", iteration);

    return state;
}