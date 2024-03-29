const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const ytdl = require( 'ytdl-core' );
const ytpl = require( 'ytpl' );

const youtube = require( '../util/youtube.js' );
const { erremb, norpembed } = require( '../util/embed.js' );
const { adder } = require( '../functions/adder.js' );
const { usercheck } = require('../util/check.js');
const { searchButton } = require( '../util/button.js' );
const timeConvert = require('../util/timeConvert.js');

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

function val_to_dt( val_in, interaction )
{
    youtube.getVideo( val_in, ( data ) =>
    {
        return adder( interaction, data.title, data.id, data.length, data.author, false );
    } );
};

module.exports =
{
	data: new SlashCommandBuilder( )
		.setName( '재생' )
		.setDescription( '노래를 재생하거나 재생목록에 추가합니다.' )
        .addStringOption( ( option ) =>
        option.setName( '옵션' )
            .setDescription( '유튜브 영상이나 재생목록의 URL 또는 제목을 입력해주세요.' )
            .setRequired( true ) ),
    
	async execute( interaction )
    {
        let val = interaction.options.data[0].value;

        const permit = usercheck( interaction )
        if ( permit )
        {
            interaction.reply( { embeds: [ permit ] } );
            return;
        }

        //URL
        if ( val.startsWith( 'http' ) )
        {
            if ( val.search( 'v=' ) > -1 )
            {
                val = val.split( 'v=' )[ 1 ];

                if ( val.search( '&' ) > -1 )
                {
                    val = val.split( '&' )[ 0 ];
                }

                if ( ytdl.validateID( val ) )
                {
                    const listemb = new EmbedBuilder( )
                        .setColor( '#FFFFFF' )
                        .setTitle( ':repeat:  URL을 불러오고 있어요.' );

                    try
                    {
                        let data = await ytdl.getBasicInfo( 'https://youtu.be/' + val );

                        await interaction.reply( { embeds: [ listemb ] } );
                        await interaction.editReply({ content: `:musical_note:  **${ data.videoDetails.title }** 대기열에 추가됨!`, embeds: [ ] } );

                        val_to_dt( val, interaction );
                        return;
                    }
                    catch ( error )
                    {
                        interaction.reply( '재생할 수 없는 영상입니다.' );
                        return;
                    }
                }
                else
                {
                    interaction.reply( { embeds: [ erremb( 'URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                    return;
                }
            }
            else if ( val.search( 'youtu.be/' ) > -1 )
            {
                val = val.split( 'youtu.be/' )[ 1 ];

                if ( val.search( '=' ) > -1 )
                {
                    val = val.split( '?' )[ 0 ];
                }

                if ( ytdl.validateID( val ) )
                {
                    let data;
                    
                    try
                    {
                        data = await ytdl.getBasicInfo( 'https://youtu.be/' + val );
                    }
                    catch ( error )
                    {
                        return interaction.reply( '재생할 수 없는 영상입니다.' );
                    }

                    const listemb = new EmbedBuilder( )
                        .setColor( '#FFFFFF' )
                        .setTitle( ':repeat:  URL을 불러오고 있어요.' );
                    
                    await interaction.reply( { embeds: [ listemb ] } );
                    await interaction.editReply( { content: `:musical_note:  **${ data.videoDetails.title }** 대기열에 추가됨!`, embeds: [ ] } );

                    val_to_dt( val, interaction );
                    return;
                }
                else
                {
                    interaction.reply( { embeds: [ erremb( 'URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                    return;
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
                            interaction.editReply( { embeds: [ erremb( 'URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                            return;
                        }
    
                        let res = '';
                        let orig = 1, song = 0, over = 0;
    
                        for ( let unter in list )
                        {
                            try
                            {
                                const data = await ytdl.getBasicInfo( `https://youtu.be/${ list[ unter ].id }` );

                                if ( orig <= 20 )
                                {
                                    res += '**`' + orig + '`**  ' + list[ unter ].title + `   \`\`${ timeConvert( data.videoDetails.lengthSeconds ) }\`\`` + '\n';
                                    ++orig;
                                }
                                else
                                {
                                    over++;
                                }

                                await adder( interaction, list[ unter ].title, data.videoDetails.videoId, data.videoDetails.lengthSeconds, data.videoDetails.author, true );
                            }
                            catch ( err )
                            {
                                song += 1
                            }
                        }
    
                        if ( over > 0 )
                        {
                            res += `\n**..외 ${ over }개의 노래**\n`
                        }    
                        if ( song > 0 )
                        {
                            res += `\n**${ song }개의 노래가 재생 불가합니다.**`
                        }

                        const listemb = new EmbedBuilder( )
                            .setColor( '#FFFFFF' )
                            .setTitle( `:white_check_mark: ${ orig + over - 1 }개의 노래를 대기열에 추가했습니다!` )
                            .setDescription( res )
                            .setThumbnail( `https://img.youtube.com/vi/${ list[ 0 ].id }/mqdefault.jpg` );

                        await interaction.editReply( { embeds: [ listemb ] } );
                        return;
                    });

                }
                else
                {
                    interaction.reply( { embeds: [ erremb( 'URL이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                    return;
                }
            }
            //Playlist
            else
            {
                interaction.reply( { embeds: [ erremb( 'URL 형식이 올바르지 않습니다! URL이 올바른지 다시 한번 확인 해주세요!' ) ] } );
                return;
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
                    res += '**`' + ( parseInt( unter ) + 1 ) + '`**  ' + videos[ unter ].snippet.title + '\n';
                }

                const embed = new EmbedBuilder()
                    .setColor( '#FFFFFF' )
                    .setAuthor( { name: '검색 결과', iconURL: interaction.user.displayAvatarURL( ) } )
                    .setDescription( res )
                    .setFooter( { text: '트랙 번호에 해당하는 버튼을 눌러주세요!' } );


                interaction.reply( { embeds: [ embed ], components: [ searchButton( interaction )[ 0 ], searchButton( interaction )[ 1 ], searchButton( interaction )[ 2 ] ] } ).then( async ( ) =>
                {
                    let check;

                    interaction.channel.awaitMessageComponent(
                    {
                        filter: m => m.user.id === interaction.user.id,
                        max: 1,
                        time: 30000,
                        errors: [ 'time' ]
                    } ).then( async ( response ) =>
                    {
                        check = true;

                        if ( response.customId == 'cancel' )
                        {
                            return interaction.editReply( { embeds: [ norpembed( '곡 선택이 취소되었습니다!', '잘못 검색한건가요?' ) ], components: [ ] } );
                        }

                        if ( parseInt( response.customId ) > 0 && parseInt( response.customId ) < 11 )
                        {
                            response.customId = parseInt( response.customId ) - 1;
                            
                            try
                            {
                                const data = await ytdl.getBasicInfo( 'https://youtu.be/' + videos[ response.customId ].id.videoId );

                                interaction.editReply( { content: `:musical_note:  **${ data.videoDetails.title }** 대기열에 추가됨!`, embeds: [ ], components: [ ] } );

                                adder( interaction, data.videoDetails.title, data.videoDetails.videoId, data.videoDetails.lengthSeconds, data.videoDetails.author, false );
                                return;
                            }
                            catch ( error )
                            {
                                interaction.editReply( { content: '재생할 수 없는 영상입니다.', embeds: [ ], components: [ ] } );
                                return;
                            }
                        }
                        else
                        {
                            interaction.editReply( { embeds: [ norpembed( '곡 선택이 취소되었습니다!', '올바르지 않은 버튼을 눌렀...어케했????' ) ], components: [ ] } );
                            return;
                        }
                    } ).catch( ( err ) =>
                    {
                        if ( !check )
                        {
                            interaction.editReply( { embeds: [ norpembed( '곡 선택이 취소되었습니다!', '곡을 선택하는데 너무 오랜 시간이 걸렸습니다.' ) ], components: [ ] } );
                        }
                        return;
                    } );
                } );

            } );
        }
        //Search
	}
};