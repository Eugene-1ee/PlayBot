const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );
const { skiper } = require( '../functions/skiper.js' );
const { songcheck, usercheck } = require('../util/check.js');

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '스킵' )
		.setDescription( '재생중인 영상을 스킵해요.' )
        .addStringOption( ( option ) =>
            option.setName( '번호' )
                .setDescription( '트랙 번호를 입력하면 대기열에서 해당 트랙을 제거해요.' )
                .setRequired( false ) ),
    
	async execute( interaction )
    {
        let val;

        if ( interaction.options.data[0] )
        {
            val = interaction.options.data[0].value;
        }

        if ( songcheck( interaction ) )
        {
            return interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
        }

        const permit = usercheck( interaction )
        if ( permit )
        {
            interaction.reply( { embeds: [permit] } );
            return;
        }

        val = parseInt( val );

        if ( !val || val == 0 )
        {
            val = 0;
        }

        if ( val > -1 && val < Object.keys( playlist[ interaction.guild.id ] ).length )
        {

            let temp_tilt = { title: playlist[interaction.guild.id][val]['title'], id: playlist[interaction.guild.id][val]['id'] };

            skiper( interaction, val, ( ) =>
            {
                const skiemb = new EmbedBuilder( )
                    .setColor( '#535353' )
                    .setTitle( `:track_next:  ${ val == 0 ? '스킵' : '해당 트랙이 제거' }되었습니다!` )
                    .setFooter( { text: `Added by ${temp_tilt.user.username}#${temp_tilt.user.discriminator}`, iconURL: temp_tilt.user.displayAvatarURL( ) } )
                    .setDescription( temp_tilt.title )
                    .setThumbnail( `[https://img.youtube.com/vi/${temp_tilt.id}/mqdefault.jpg](https://www.youtube.com/watch?v=${temp_tilt.id})` );

                interaction.reply( { embeds: [ skiemb ] } )
                return;
            } );
        }
        else
        {
            interaction.reply( { embeds: [ norpembed( ':grey_question:  ' + ( val ) + '번 트랙을 찾지 못했습니다!', '대기열에서 트랙 번호를 다시 한번 확인 해주세요!' ) ] } );
            return;
        }
    }
}