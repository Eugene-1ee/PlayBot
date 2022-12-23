const fs = require( 'fs' );

/**
 * Reset temp
 */
function reset()
{
    const files = fs.readdirSync( 'temp' );
        
    for ( const file of files )
    {
        fs.unlink( `temp/${ file }`, err => {
            if ( err )
            {
                throw err;
            }
          
            console.log('Temp(Music) is deleted.');
        } );
    }      
};

module.exports = reset;