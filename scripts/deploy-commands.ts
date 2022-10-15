/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
// tslint:disable no-submodule-imports

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { loadEnv } from "../src/utils/loadEnv";

loadEnv();

const commands: any[] = [];

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

rest.put(
    Routes.applicationCommands("541838049248804884"),
    // Routes.applicationGuildCommands(
    //     "541838049248804884",
    //     "535332275491962890",
    // ),
    { body: commands }
)
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
