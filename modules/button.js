const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require( 'discord.js' );
const timeConvert = require( './timeConvert' );

class Button
{
    page2( interaction, now )
    {
        let row;
        if ( now == 0 )
        {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '◀' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '▶' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( 'InteractionUserName' )
                .setLabel( `Requested by ${interaction.user.username + '#' + interaction.user.discriminator}` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );
        }
        else
        {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '◀' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '▶' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( 'InteractionUserName' )
                .setLabel( `Requested by ${interaction.user.username + '#' + interaction.user.discriminator}` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );
        }

        return row;
    }

    pagemore( interaction, now, max )
    {
        let row;
        if ( now == 0 )
        {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '0' )
                .setLabel( '◀◀' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '◀' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '▶' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '3' )
                .setLabel( '▶▶' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( 'InteractionUserName' )
                .setLabel( `Requested by ${interaction.user.username + '#' + interaction.user.discriminator}` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );
        }
        else if ( now == max )
        {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '0' )
                .setLabel( '◀◀' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '◀' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '▶' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( '3' )
                .setLabel( '▶▶' )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ),
                new ButtonBuilder()
                .setCustomId( 'InteractionUserName' )
                .setLabel( `Requested by ${interaction.user.username + '#' + interaction.user.discriminator}` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );
        }
        else
        {
            row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '0' )
                .setLabel( '◀◀' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '◀' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '▶' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( '3' )
                .setLabel( '▶▶' )
                .setStyle( ButtonStyle.Secondary ),
                new ButtonBuilder()
                .setCustomId( 'InteractionUserName' )
                .setLabel( `Requested by ${interaction.user.username + '#' + interaction.user.discriminator}` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );
        }

        return row;
    }
}

module.exports = Button;