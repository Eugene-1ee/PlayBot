const https = require( "https" );
const ytdl = require( "ytdl-core" );
const ytpl = require( "ytpl" );
require( "dotenv" ).config( );

function search( q, callback )
{
    let options =
    {
        host: "www.googleapis.com",
        path: encodeURI( "/youtube/v3/search?part=snippet&fields=items(id,snippet(title))&q=" + q + "&type=video&maxResults=10&key=" + process.env.Youtube_Api )
    };

    gety( options, ( data ) =>
    {
        return callback( data );
    } );
};

async function getVideo( id, callback )
{
    let data_temp = await ytdl.getBasicInfo( "https://youtu.be/" + id );

    let data = new Map();
    data[ "id" ] = data_temp[ "videoDetails" ][ "videoId" ];
    data[ "title" ] = data_temp[ "videoDetails" ][ "title" ];
    data[ "length" ] = data_temp[ "videoDetails" ][ "lengthSeconds" ];

    return callback( data );
};

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

    playlist = playlist[ "items" ];

    return callback( playlist );
};

async function relatedVideo( id, callback )
{
    let data_temp = await ytdl.getBasicInfo( "https://youtu.be/" + id );

    return callback( data_temp[ "related_videos" ] );
};

function gety( option, callback )
{
    https.get( option, function( res )
    {
        var rse = "";

        res.on( "data", function( chunk )
        {
            rse += chunk;
        } );

        res.on( "end", function( )
        {
            rse = JSON.parse(rse);

            return callback(rse);
        } );
    } ).on( "error", function( error )
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
