const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );
const { skiper } = require( '../functions/skiper.js' );

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );
const { songcheck } = require('../util/check.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '스킵' )
		.setDescription( '재생중인 영상을 스킵해요.' )
        .addStringOption( ( option ) =>
            option.setName( '번호' )
                .setDescription( '트랙 번호를 입력해주세요. 해당 트랙을 스킵해요.' )
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
            return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  재생 중인 노래가 없습니다!' ) ] } );
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
                // .setColor('#0x7d3640')
                    .setTitle( ':track_next:  스킵되었습니다!' )
                    .setDescription( temp_tilt.title )
                    .setThumbnail( 'https://img.youtube.com/vi/' + temp_tilt.id + '/mqdefault.jpg' );

                return interaction.reply( { embeds: [ skiemb ] } );
            } );
        }
        else
        {
            return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  ' + (val) + '번 트랙을 찾지 못했습니다!\n재생목록 에서 트랙 번호를 다시 한번 확인 해주세요!' ) ] } );
        }
    }
}