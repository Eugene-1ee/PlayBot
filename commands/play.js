const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const ytdl = require( 'ytdl-core' );
const ytpl = require( 'ytpl' );
const youtube = require( '../util/youtube.js' );

const { erremb, norpembed } = require( '../util/embed.js' );
const { adder } = require( '../functions/adder.js' );
const timeConvert = require('../util/timeConvert.js');

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );


function val_to_dt( val_in, interaction )
{
    youtube.getVideo( val_in, ( data ) =>
    {
        return adder( interaction, data.title, data.id, data.length, false );
    } );
};

module.exports =
{
	data: new SlashCommandBuilder( )
		.setName( '재생' )
		.setDescription( '노래를 재생하거나 재생목록에 추가합니다.' )
        .addStringOption( ( option ) =>
            option.setName( '옵션' )
                .setDescription( '유튜브 영상의 URL 또는 제목을 입력해주세요. 재생목록도 가능합니다.' )
                .setRequired( true ) ),
    
	async execute( interaction )
    {
        let val = interaction.options.data[0].value;

        //URL
        if ( val.startsWith( 'http' ) )
        {
            if ( val.search('v=') > -1 )
            {
                val = val.split('v=')[1];

                if ( val.search('&') > -1 )
                {
                    val = val.split('&')[0];
                }

                if ( ytdl.validateID( val ) )
                {
                    const listemb = new EmbedBuilder( )
                    // .setColor('#6b26ff')
                        .setTitle( ':crystal_ball:  **|**  URL을 불러오고 있어요.' );

                    try
                    {
                        let data = await ytdl.getBasicInfo( 'https://youtu.be/' + val );

                        interaction.reply( { embeds: [ listemb ] } );
                        interaction.deleteReply( );

                        return val_to_dt( val, interaction );
                    }
                    catch ( error )
                    {
                        return interaction.reply( '재생할 수 없는 영상이야!' );
                    }
                }
                else
                {
                    return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  **|**  URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                }
            }
            else if ( val.search('youtu.be/') > -1 )
            {
                val = val.split('youtu.be/')[1];

                if ( val.search('=') > -1 )
                {
                    val = val.split('?')[0];
                }

                if ( ytdl.validateID( val ) )
                {
                    try
                    {
                        let data = await ytdl.getBasicInfo( 'https://youtu.be/' + val );
                    }
                    catch ( error )
                    {
                        return interaction.reply( '재생할 수 없는 영상이야!' );
                    }

                    const listemb = new EmbedBuilder( )
                    // .setColor('#6b26ff')
                        .setTitle( ':crystal_ball:  **|**  URL을 불러오고 있어요.' );
                    
                    await interaction.reply( { embeds: [ listemb ] } );
                    await interaction.editReply({ content: "성공", embeds: [] } );

                    return val_to_dt( val, interaction );
                }
                else
                {
                    return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  **|**  URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                }
            }
            //Playlist
            else if ( val.search( 'list=' ) > -1 )
            {
                val = val.split( 'list=' )[ 1 ];

                if ( val.search( '&' ) > -1 )
                {
                    val = val.split( '&' )[ 0 ];
                }

                if ( ytpl.validateID( val ) )
                {
                    youtube.getPlaylist( val, async ( list ) =>
                    {
                        await interaction.deferReply( );
                        if ( !list )
                        {
                            return interaction.editReply( { embeds: [ erremb( ':triangular_flag_on_post:  **|**  URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                        }
    
                        let res = '';
                        let orig = 1, song = 0, word = 0, over = 0;
    
                        for ( let unter in list )
                        {
                            try
                            {
                                let data = await ytdl.getBasicInfo( 'https://youtu.be/' + list[unter].id );

                                if ( word <= 1500 )
                                {
                                    res += '**`' + orig + '`**  ' + list[unter].title + `  \`\`${timeConvert( list[unter].durationSec )}\`\`` + '\n';
                                    ++orig;
                                }
                                else
                                {
                                    over++;
                                }

                                await adder( interaction, list[unter].title, list[unter].id, list[unter].durationSec, true );
                            }
                            catch ( err )
                            {
                                console.log( '재생할 수 없는 영상이 있음' );
                                song += 1
                            }
                        }
    
                        if ( over > 0 )
                        {
                            res += `\n**${over}개의 노래 더 있음...**\n`
                        }    
                        if ( song > 0 )
                        {
                            res += `\n**${song}개의 노래가 재생이 불가함.**`
                        }

                        const listemb = new EmbedBuilder( )
                        // .setColor('#0x7d3640')
                            .setTitle( `:white_check_mark: ${orig + over - 1}개의 노래를 대기열에 추가했습니다!` )
                            .setDescription( res )
                            .setThumbnail( 'https://img.youtube.com/vi/' + list[0].id + '/mqdefault.jpg' );
 
                        return await interaction.editReply( { embeds: [ listemb ] } );
                    });

                }
                else
                {
                    return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  **|**  URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                }
            }
            //Playlist
            else
            {
                return interaction.reply( { embeds: [ erremb( ':triangular_flag_on_post:  **|**  URL 형식이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
            }
        }
        //URL

        //Search
        else
        {
            youtube.search( val, async ( videos ) =>
            {
                videos = videos.items;

                let res = '';
                for ( let unter in videos )
                {
                    res += '**`' + ( parseInt(unter) + 1 ) + '`** | ' + videos[unter].snippet.title + '\n';
                }

                let src = new EmbedBuilder()
                // .setColor('#0x7d3640')
                    .setAuthor( { name: '검색 결과', iconURL: interaction.user.displayAvatarURL( ) } )
                    .setDescription( res )
                    .setFooter( { text: '트랙 번호만 입력하시거나 취소하시려면  `취소`  라고 입력해 주세요.' } );

                interaction.reply( { embeds: [src] } ).then( async ( ) =>
                {
                    interaction.channel.awaitMessages(
                    {
                        filter: m => m.author.id === interaction.user.id,
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    }).then( async ( response ) =>
                    {
                        response = response.first();

                        if ( response.content == '취소' )
                        {
                            response.delete();

                            return interaction.editReply( { embeds: [ norpembed( ':triangular_flag_on_post:  **|**  곡 선택이 취소되었습니다!', '취소를 했다!' ) ] } );
                        }
                        if ( parseInt(response.content) > 0 && parseInt(response.content) < 11 )
                        {
                            response.delete();
                            response.content = parseInt(response.content) - 1;
                            
                            try
                            {
                                const data = await ytdl.getBasicInfo( 'https://youtu.be/' + videos[response.content].id.videoId );

                                interaction.editReply( { content: "성공", embeds: [] } );

                                return adder( interaction, videos[response.content].snippet.title, videos[response.content].id.videoId, data[ 'videoDetails' ][ 'lengthSeconds' ], false );
                            }
                            catch ( error )
                            {
                                return interaction.editReply( { content: '재생할 수 없는 영상이야!', embeds: [] } );
                            }
                        }
                        else
                        {
                            return interaction.editReply( { embeds: [ norpembed( ':triangular_flag_on_post:  **|**  곡 선택이 취소되었습니다!', '올바르지 않은 수가 입력되었습니다. 1 ~ 10 안으로 선택 해주세요.' ) ] } );
                        }
                    } ).catch( ( err ) =>
                    {
                        return interaction.editReply( { embeds: [ norpembed( ':triangular_flag_on_post:  **|**  곡 선택이 취소되었습니다!', '곡을 선택하는데 너무 오랜 시간이 걸렸습니다.' ) ] } );
                    } );
                });

            });
        }
        //Search
	}
};