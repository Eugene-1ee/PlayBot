const https = require( 'https' );
const ytdl = require( 'ytdl-core' );
const ytpl = require( 'ytpl' );
require( 'dotenv' ).config( );

/**
 * 검색 정보 가져오기
 * @param { string } q 검색어
 * @returns 검색 정보
 */
function search( q, callback )
{
    let options =
    {
        host: 'www.googleapis.com',
        path: encodeURI( '/youtube/v3/search?part=snippet&fields=items(id,snippet(title))&q=' + q + '&type=video&maxResults=10&key=' + process.env.Youtube_Api )
    };

    gety( options, ( data ) =>
    {
        return callback( data );
    } );
};

/**
 * 노래 정보 가져오기
 * @param { string } id 비디오 id
 * @returns 노래 정보
 */
async function getVideo( id, callback )
{
    let data_temp = await ytdl.getBasicInfo( 'https://youtu.be/' + id );

    let data = new Map();
    data[ 'id' ] = data_temp[ 'videoDetails' ][ 'videoId' ];
    data[ 'title' ] = data_temp[ 'videoDetails' ][ 'title' ];
    data[ 'length' ] = data_temp[ 'videoDetails' ][ 'lengthSeconds' ];

    return callback( data );
};

/**
 * 플레이리스트 정보 가져오기
 * @param { string } id 플레이리스트 id
 * @returns 플레이리스트 정보
 */
async function getPlaylist( id, callback )
{
    let playlist;

    try
    {
        playlist = await ytpl( id );
    }
    catch
    {
        return callback( null );
    }

    playlist = playlist[ 'items' ];

    return callback( playlist );
};

/**
 * 관련된 영상 가져오기
 * @param { string } id 비디오 id
 * @returns 관련된 영상 정보
 */
async function relatedVideo( id, callback )
{
    let data_temp = await ytdl.getBasicInfo( 'https://youtu.be/' + id );

    return callback( data_temp[ 'related_videos' ] );
};

/**
 * 검색 정보 반환
 * @param { string } option search 명령어 option값
 * @returns 검색 정보
 */
function gety( option, callback )
{
    https.get( option, function( res )
    {
        var rse = '';

        res.on( 'data', function( chunk )
        {
            rse += chunk;
        } );

        res.on( 'end', function( )
        {
            rse = JSON.parse(rse);

            return callback(rse);
        } );
    } ).on( 'error', function( error )
    {
        return callback( JSON.parse( "status:{message: 'Error On Req', status_code: 404}" ) );
    } );
};

module.exports =
{
    search: search,
    getVideo: getVideo,
    getPlaylist: getPlaylist,
    relatedVideo: relatedVideo
};
