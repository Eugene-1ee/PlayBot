const { EmbedBuilder, SlashCommandBuilder } = require( "discord.js" );
const { getVoiceConnection } = require( "@discordjs/voice" );
const { erremb } = require( "../util/embed.js" );
const { cleanup } = require( "../functions/cleanup.js" );

let { connection, player, playlist, resource, volume, station } = require( "../functions/val.js" );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( "나가" )
		.setDescription( "재생을 멈추고 통화방에서 나갑니다." ),
    
	async execute( interaction )
    {
        if ( !connection[ interaction.guild.id ] || getVoiceConnection( interaction.guild.id )._state.status !== "ready" )
        {
            return erremb( interaction, ":triangular_flag_on_post:  **|**  재생 중인 노래가 없습니다!" );
        }

        cleanup( interaction.guild.id );

        const stemb = new EmbedBuilder( )
            // .setColor( "#0x7d3640" )
            .setTitle( ":stop_button:  **|**  노래 재생을 멈췄습니다!" );
        return interaction.reply( { embeds: [ stemb ] });
    }
}