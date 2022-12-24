const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );
const Button = require( '../modules/button' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'queue' )
        .setDescription( '대기열을 표시합니다' )
        .addNumberOption( option => option
            .setName( 'remove' )
            .setDescription( '대기열에서 제거할 번호를 입력해주세요' ) ),
        
    async execute( interaction )
    {
        await interaction.deferReply( );

        const number = interaction.options.getNumber( 'remove' );

        const audio = new Audio( interaction.guildId );

        const time = parseInt( audio.player._state.playbackDuration / 1000 );

        if ( audio.playlist[ 0 ] )
        {
            const totalPages = Math.ceil( audio.playlist.length / 10 ) || 1;

            if ( number || number == 0 )
            {
                if ( getVoiceConnection( interaction.guildId ).joinConfig.channelId !== interaction.member.voice.channelId )
                {
                    interaction.editReply( 'Interactive only on the same voice channel' );
                    return;
                }
                else if ( number % 1 !== 0 || number <= 0 || number > audio.playlist.length - 1 || number === 0 )
			    {
				    await interaction.editReply( `There's no Num-${number} song\nThere are ${ audio.playlist.length - 1 } songs in queue` );
			    }
                else
                {
                    const songInfo = audio.playlist[ number ];

                    const embed = new EmbedBuilder( )
                    .setTitle( `Music deleted!` )
                    .setDescription( `[${songInfo.title}](${songInfo.video_url})` )
            	    .setColor( '#8ede7a' )
                    .setThumbnail( songInfo.thumbnails.at( -1 ).url );

                    audio.playlist.splice( number, 1 );

                    await interaction.editReply( { embeds : [ embed ] } );
                }
            }
            else if ( totalPages == 1 )
            {
                const embed = new Embed( ).playlist( audio.playlist, time, 0 );
                await interaction.editReply( { embeds : [ embed ] } );
            }
            else if ( totalPages == 2 )
            {
                let page = 0;

                const embed = new Embed( ).playlist( audio.playlist, time, page );

                const row = new Button( ).page2( interaction, page );

                await interaction.editReply( { embeds : [ embed ], components: [row] } );

                const filter = ( ButtonInteraction ) => ButtonInteraction.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector(
                    { filter, time: 120000 } );
                    
                collector.on( 'collect', async ( ButtonInteraction ) => {
                    ButtonInteraction.deferUpdate();

                    if ( ButtonInteraction.customId == 1 )
                    {
                        page = 0;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).page2( interaction, page );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                    else
                    {
                        page = 1;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).page2( interaction, page );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                } );
                    
                collector.on('end', collected =>
                {
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId( 'Timeout' )
                        .setLabel( `Expired after 120 seconds` )
                        .setStyle( ButtonStyle.Secondary )
                        .setDisabled( true ) );

                    interaction.editReply( { components : [ row ] } );
                } );
            }
            else
            {
                let page = 0;

                const embed = new Embed( ).playlist( audio.playlist, time, page );

                const row = new Button( ).pagemore( interaction, page, totalPages );

                await interaction.editReply( { embeds : [ embed ], components: [row] } );

                const filter = ( ButtonInteraction ) => ButtonInteraction.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector(
                    { filter, time: 120000 } );
                    
                collector.on( 'collect', async ( ButtonInteraction ) =>
                {
                    ButtonInteraction.deferUpdate();

                    if ( ButtonInteraction.customId == 0 )
                    {
                        page = 0;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).pagemore( interaction, page, totalPages );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                    else if ( ButtonInteraction.customId == 1 )
                    {
                        page -= 1;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).pagemore( interaction, page, totalPages );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                    else if ( ButtonInteraction.customId == 2 )
                    {
                        page += 1;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).pagemore( interaction, page, totalPages );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                    else
                    {
                        page = totalPages - 1;
                        const time = parseInt( audio.player._state.playbackDuration / 1000 );
                        const row = new Button( ).pagemore( interaction, page, totalPages );
                        const embed = new Embed( ).playlist( audio.playlist, time, page );

                        await interaction.editReply( { embeds : [ embed ], components: [ row ] } );
                    }
                } );
                    
                collector.on( 'end', collected =>
                {
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId( 'Timeout' )
                        .setLabel( `Expired after 120 seconds` )
                        .setStyle( ButtonStyle.Secondary )
                        .setDisabled( true ) );

                    interaction.editReply( { components : [ row ] } );
                } );
            }
        }
        else
        {
            await interaction.editReply( 'Queue is empty' );
        }
    }
};