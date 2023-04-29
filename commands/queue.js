const { EmbedBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require( "discord.js" );
const { getVoiceConnection } = require( "@discordjs/voice" );
const { erremb, queue } = require( "../util/embed.js" );
const { Buttonpage2, pagemore } = require( "../util/button.js" )

let { connection, player, playlist, resource, volume, station } = require( "../functions/val.js" );

module.exports = {
	data: new SlashCommandBuilder( )
		.setName( "대기열" )
		.setDescription( "재생 목록과 트랙 번호를 볼 수 있아요." ),
    
	async execute( interaction )
    {
        if ( !connection[ interaction.guild.id ] || getVoiceConnection( interaction.guild.id )._state.status !== "ready" )
        {
            return erremb( interaction, ":triangular_flag_on_post:  **|**  재생 목록을 찾지 못했어요." );
        }

        if ( !playlist[ interaction.guild.id ] )
        {
            return erremb( interaction, ":triangular_flag_on_post:  **|**  재생 목록이 없어요." );
        }


        let a = 0;
        for ( let unter in playlist[ interaction.guild.id ] )
        {
            a++;
        }

        const totalPages = Math.ceil( a / 10 ) || 1;

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
                { filter, time: 60000 } );
                
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
                    .setLabel( `Expired after 60 seconds` )
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
                { filter, time: 60000 } );

            collector.on( 'collect', async ( ButtonInteraction ) =>
            {
                ButtonInteraction.deferUpdate();
                let a = 0;
                for ( let unter in playlist[ interaction.guild.id ] )
                {
                    a++;
                }

                const totalPages = Math.ceil( a / 10 ) || 1;

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
                    .setLabel( `Expired after 60 seconds` )
                    .setStyle( ButtonStyle.Secondary )
                    .setDisabled( true ) );

                interaction.editReply( { components : [ row ] } );
            } );
        }
    }
}