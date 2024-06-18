const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );
const { skiper } = require( '../functions/skiper.js' );
const { songcheck, usercheck } = require('../util/check.js');

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '반복' )
		.setDescription( '반복을 설정해요' )
        .addSubcommand( subcommand => subcommand
            .setName( '노래' )
            .setDescription( '현재 재생중인 노래를 반복합니다.' ) )
        .addSubcommand( subcommand => subcommand
            .setName( '대기열' )
            .setDescription( '현재 대기열을 반복합니다.' ) ),
    
	async execute( interaction )
    {
        let val = interaction.options.getSubcommand();

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

        if ( station[ interaction.guild.id ] === 'on' )
        {
            interaction.reply( { embeds: [ erremb( '스테이션이 이미 활성화 되어있습니다!\n스테이션 기능은 반복 기능과 동시에 사용할 수 없습니다.' ) ] } );
            return;
        }
        else if ( ( station[ interaction.guild.id ] === 'song' && val === '대기열' ) || ( station[ interaction.guild.id ] === 'queue' & val === '노래' ) )
        {
            interaction.reply( { embeds: [ erremb( '다른 종류의 반복이 이미 활성화 되어있습니다!' ) ] } );
            return;
        }
        else if ( val === '노래' )
        {
            if ( !station[ interaction.guild.id ] )
            {
                station[ interaction.guild.id ] = 'song';
                const emb = new EmbedBuilder( )
                    .setColor( '#D8D8D8' )
                    .setTitle( ':repeat_one:  노래 반복이 설정되었습니다!\n다시 입력하면 노래 반복이 해제됩니다.' );
                
                interaction.reply( { embeds: [ emb ] } );
                return
            }
            else
            {
                station[ interaction.guild.id ] = false;
                const emb = new EmbedBuilder( )
                    .setColor( '#D8D8D8' )
                    .setTitle( ':negative_squared_cross_mark:  노래 반복 기능이 해제 되었습니다!' );
                
                interaction.reply( { embeds: [ emb ] } );
                return
            }
        }
        else if ( val === '대기열' )
        {
            if ( !station[ interaction.guild.id ] )
            {
                station[ interaction.guild.id ] = 'queue';
                const emb = new EmbedBuilder( )
                    .setColor( '#D8D8D8' )
                    .setTitle( ':repeat:  대기열 반복이 설정되었습니다!\n다시 입력하면 대기열 반복이 해제됩니다.' );

                interaction.reply( { embeds: [ emb ] } );
                return
            }
            else
            {
                station[ interaction.guild.id ] = false;
                const emb = new EmbedBuilder( )
                    .setColor( '#D8D8D8' )
                    .setTitle( ':negative_squared_cross_mark:  대기열 반복 기능이 해제 되었습니다!' );
                
                interaction.reply( { embeds: [ emb ] } );
                return
            }
        }
        else
        {
            interaction.reply( { embeds: [ erremb( '지정된 반복 상태가 올바르지 않습니다..?!\n이건 무슨 오류지?' ) ] } );
            return;
        }
    }
}