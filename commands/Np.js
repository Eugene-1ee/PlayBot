const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "np" )
        .setDescription( "음악 진행 상황을 확인합니다" ),
        
	async execute( interaction, client )
    {
        await interaction.deferReply();

		const queue = client.player.getQueue( interaction.guildId );

		if ( !queue || !queue.playing ) // 재생 여부 확인
        {
            return;
        }
        else
        {
            const currentSong = queue.current;

            const seconds = parseInt( queue.connection.audioResource.playbackDuration / 1000 );
            const hour = parseInt( seconds / 3600 );
            const min = parseInt(( seconds % 3600 ) / 60 );
            const sec = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;
            
            if ( hour !== 0 ) //진행 시간 계산
            {
                currentTime = `${ hour }:${ min }:${ sec }`;
            }
            else
            {
                currentTime = `${ min }:${ sec }`;
            }
            const bar = queue.createProgressBar( {
                queue: false,
                length: 12 } );
    
            const repeatMode1 = queue.repeatMode === 1 ? '🔂' : ''
            const repeatMode2 = queue.repeatMode === 2 ? '🔁' : ''
            const Pause = queue.connection.paused ? '⏸' : '▶'
            
            const Embed = new MessageEmbed()
            .setTitle( `Now Playing ${Pause}${repeatMode1}${repeatMode2}` )
            .setDescription( `[${currentSong.title}](${currentSong.url})\n${currentTime}  ` + bar + `  ${currentSong.duration}` )
            .setColor( '#9080a1' )
            .setFooter( { text : `Added by ${currentSong.requestedBy.username + '#' + currentSong.requestedBy.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${currentSong.requestedBy.id}/${currentSong.requestedBy.avatar}.webp` } );
            
            await interaction.editReply( { embeds: [ Embed ] } );
        }
	}
};