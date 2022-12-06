const { MessageEmbed } = require( "discord.js" );
const { prefix } = require( '../assets/config.json' );

module.exports = {
	data : [ 'remove' ],
	async execute( message, client )
	{
        const queue = client.player.getQueue( message.guildId );

        const choose = message.content.replace( prefix, '' ).split( ' ' )[ 1 ];

		if ( !queue ) //대기열 확인
        {
            await message.reply( "There's no song." );
        }
		else if ( message.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            await message.reply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `You can only interact on ${queue.connection.channel}!` )
                .setColor( '#ff0000' )
            ] } );
        }
        else if ( !choose || !Number( choose ) )
        {
            await message.reply( 'Please enter the correct song number!' );
        }
        else
        {
            const totalLength = queue.tracks.length
			const trackIndex = ( choose || 1 ) - 1;

			if ( trackIndex % 1 !== 0 || trackIndex < 0 || trackIndex > totalLength - 1 || choose == 0 )
			{
				await message.reply( `There's no ${ choose } song.\nThere are ${totalLength} songs in total.` );
			}
			else
			{
				const track = await queue.tracks[trackIndex];
				await queue.remove( trackIndex );

				await message.reply( { embeds : [ 
            	    new MessageEmbed()
            	    .setDescription( `**Music deleted!**\n[${track.title}](${track.url})` )
					.setThumbnail( track.thumbnail )
            	    .setColor( '#8ede7a' )
                    .setFooter( { text : `Added by ${track.requestedBy.username + '#' + track.requestedBy.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${track.requestedBy.id}/${track.requestedBy.avatar}.webp` } ) ] } );
			}
        }
    }
}
