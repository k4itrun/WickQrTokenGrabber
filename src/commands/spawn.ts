import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonStyle,
  PermissionsBitField,
} from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import * as embeds from "../util/embeds";

import { ownerIDS } from "../config.json";

export default {
  name: "spawn",
  data: new SlashCommandBuilder()
    .setName("spawn")
    .setDescription("Generate the verification message!"),
  async callback(interaction: CommandInteraction) {
    
    function isOwner(ownerId: string | number): boolean {
      if (typeof ownerId === "number") {
        ownerId = ownerId.toString();
      }
      return ownerIDS.includes(ownerId);
    }
    
    const userId = interaction.user.id; 
    if (!isOwner(userId)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [await embeds.lackPermissionsEmebd()],
      });
    }

    /* if (
      !(
        interaction.member?.permissions as Readonly<PermissionsBitField>
      ).has(PermissionsBitField.Flags.ManageGuild)
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [await embeds.lackPermissionsEmebd()],
      });
    } */

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Verify Here")
        .setStyle(ButtonStyle.Success)
        .setCustomId("verify"),
      new ButtonBuilder()
        .setLabel("Help")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("help")
    );

    interaction.reply({
      ephemeral: true,
      content: "Spawned verify message.",
    });

    interaction.channel?.send({
      embeds: [await embeds.verifyMessageEmbed()],
      components: [actionRow],
    });
  },
};
