const { EmbedBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb, queue } = require( '../util/embed.js' );
const { Buttonpage2, pagemore } = require( '../util/button.js' )

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );
const { songcheck } = require('../util/check.js');

module.exports = {
	data: new SlashCommandBuilder( )
		.setName( '대기열' )
		.setDescription( '대기열을 볼 수 있습니다.' ),
    
	async execute( interaction )
    {
        if ( songcheck( interaction ) )
        {
            return interaction.reply( { embeds : [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
        }

        let a = 0;
        for ( let unter in playlist[ interaction.guild.id ] )
        {
            a++;
        }

        const totalPages = Math.ceil( ( a - 1 ) / 10 ) || 1;

        if ( totalPages == 1 )
        {
            const embed = queue( interaction, 0 );
            await interaction.reply( { embeds : [ embed ] } );
        }
        else if ( totalPages == 2 )
        {
            let page = 0;

            const embed = queue( interaction, page );

            const row = Buttonpage2( interaction, page );

            await interaction.reply( { embeds : [ embed ], components: [row] } );

            const filter = ( ButtonInteraction ) => ButtonInteraction.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector(
                { filter, time: 30000 } );
                
            collector.on( 'collect', async ( ButtonInteraction ) => {
                ButtonInteraction.deferUpdate();

                if ( ButtonInteraction.customId == 1 )
                {
                    page = 0;

                    const row = Buttonpage2( interaction, page );
                    const embed = queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
                else
                {
                    page = 1;

                    const row = Buttonpage2( interaction, page );
                    const embed = queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
            } );
                
            collector.on( 'end', collected =>
            {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId( 'Timeout' )
                    .setLabel( `Expired after 30 seconds` )
                    .setStyle( ButtonStyle.Secondary )
                    .setDisabled( true ) );

                interaction.editReply( { components : [ row ] } );
            } );
        }
        else
        {
            let page = 0;

            const embed = queue( interaction, page );

            const row = pagemore( interaction, page, totalPages );

            await interaction.reply( { embeds: [embed], components: [row] } );

            const filter = ( ButtonInteraction ) => ButtonInteraction.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector(
                { filter, time: 30000 } );

            collector.on( 'collect', async ( ButtonInteraction ) =>
            {
                ButtonInteraction.deferUpdate();
                let a = 0;
                for ( let unter in playlist[ interaction.guild.id ] )
                {
                    a++;
                }

                const totalPages = Math.ceil( ( a - 1 ) / 10 ) || 1;

                if ( ButtonInteraction.customId == 0 )
                {
                    page = 0;

                    const row = pagemore( interaction, page, totalPages );
                    const embed = new queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
                else if ( ButtonInteraction.customId == 1 )
                {
                    page -= 1;

                    const row = pagemore( interaction, page, totalPages );
                    const embed = queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
                else if ( ButtonInteraction.customId == 2 )
                {
                    page += 1;

                    const row = pagemore( interaction, page, totalPages );
                    const embed = queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
                else
                {
                    page = totalPages - 1;

                    const row = pagemore( interaction, page, totalPages );
                    const embed = queue( interaction, page );

                    await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                }
            } );

            collector.on( 'end', collected =>
            {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId( 'Timeout' )
                    .setLabel( `Expired after 30 seconds` )
                    .setStyle( ButtonStyle.Secondary )
                    .setDisabled( true ) );

                interaction.editReply( { components : [ row ] } );
            } );
        }
    }
}