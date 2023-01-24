const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require( 'discord.js' );
const fs = require( 'fs' );
const randomNum = require( "../modules/randNum" );
const hlEmbed = require( "../modules/hlEmbed" );

module.exports = {
	data : [ '게임1' ],
	async execute( message )
	{
        const Url = `assets/temp/${ message.author.id }.json`;

        const directory = fs.existsSync( Url )

        if ( directory )
        {
            await message.reply( "이미 게임이 실행중이야!" );
        }
        else
        {
            const Num = [ 0, 0 ]
            while ( Num[ 0 ] == Num[ 1 ] )
            {
                Num[ 0 ] = randomNum( 0, 8 ) + randomNum( 0, 3 ) * 9;
                Num[ 1 ] = randomNum( 0, 8 ) + randomNum( 0, 3 ) * 9;
            }

            const array = [ "🔴1", "🔴2", "🔴3", "🔴4", "🔴5", "🔴6", "🔴7", "🔴8", "🔴9",
                            "🔵1", "🔵2", "🔵3", "🔵4", "🔵5", "🔵6", "🔵7", "🔵8", "🔵9",
                            "🟢1", "🟢2", "🟢3", "🟢4", "🟢5", "🟢6", "🟢7", "🟢8", "🟢9",
                            "🟡1", "🟡2", "🟡3", "🟡4", "🟡5", "🟡6", "🟡7", "🟡8", "🟡9" ]

            const data = 
		    {
                "배열" : array,
                "현재" : Num[ 0 ],
                "다음" : Num[ 1 ],
                "체력" : 3,
                "점수" : 0,
                "코인" : 0,
                "진행" : 0,
                "콤보" : 0,
                "최고" : 0
		    };

            const JSONdata = JSON.stringify( data, null, "\t" );
            fs.writeFileSync( Url, JSONdata );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( '0' )
                .setLabel( '↑' )
                .setStyle( ButtonStyle.Primary ),
                new ButtonBuilder()
                .setCustomId( '1' )
                .setLabel( '↓' )
                .setStyle( ButtonStyle.Primary ),
                new ButtonBuilder()
                .setCustomId( '2' )
                .setLabel( '=' )
                .setStyle( ButtonStyle.Danger ),
                new ButtonBuilder()
                .setCustomId( '3' )
                .setLabel( '→' )
                .setStyle( ButtonStyle.Success ),
                new ButtonBuilder()
                .setCustomId( 'round' )
                .setLabel( `${ 35 }` )
                .setStyle( ButtonStyle.Secondary )
                .setDisabled( true ) );

            const Row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId( 'help' )
                .setLabel( '도움말' )
                .setStyle( ButtonStyle.Secondary ) );

            const point = -2, combo = 0;
            const Embed = hlEmbed( message, point, combo );

            const msg = await message.reply( { embeds : [ Embed ] , components : [ row, Row ] } );

		    const filter = ( ButtonInteraction ) => ButtonInteraction.user.id === message.author.id;
            
		    const collector = message.channel.createMessageComponentCollector( { 
		    	filter,
		    	time : 600000 } );
            
		    let ending;

		    collector.on( 'collect', async ( ButtonInteraction ) => {
                if ( ButtonInteraction.customId == 'help' )
                {
                    const embed = new EmbedBuilder()
                    .setColor( '#7e9091' )
                    .setTitle( '도움말' )
                    .setDescription( '게임의 규칙을 간단하게 설명해줄게!\n↑, 즉 상향은 다음에 나올 패가 현재 가진 패보다 크다고 생각하면,\n'
                                    +'↓, 즉 하향은 다음에 나올 패가 현재 가진 패보다 작다고 생각하면 눌러!\n  네가 생각한 게 맞다면 2점의 점수를 얻을거야!\n'
                                    +'= 은 다음에 나올 패와 현재 가진 패가 같다고 생각하면 누르면 돼\n무려 6점이나 얻을 수 있는 버튼이라구?\n→ 는 스킵이야! 다음 패로 넘어갈 수 있어!\n'
                                    +'→ 옆에 있는 숫자는 네가 앞으로 남은 선택의 횟수야! 총 35번이지!\n콤보는 오답인 경우에만 끊어져!\n'
                                    +'체력은 총 3칸이고, 아예 틀렸을 경우에만 소실되니까 조심히 잘 해봐!');

                    msg.edit( { embeds : [ Embed, embed ] , components : [ row ] } ); 
                }
                else
                {
                    const parsedData = JSON.parse( fs.readFileSync( Url ) );
                    parsedData[ "진행" ] += 1;
                    const now = parsedData[ "현재" ] % 9;
                    const future = parsedData[ "다음" ] % 9;

                    const choice = ButtonInteraction.customId;

                    let point = 0, combo = 0;

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId( '0' )
                        .setLabel( '↑' )
                        .setStyle( ButtonStyle.Primary ),
                        new ButtonBuilder()
                        .setCustomId( '1' )
                        .setLabel( '↓' )
                        .setStyle( ButtonStyle.Primary ),
                        new ButtonBuilder()
                        .setCustomId( '2' )
                        .setLabel( '=' )
                        .setStyle( ButtonStyle.Danger ),
                        new ButtonBuilder()
                        .setCustomId( '3' )
                        .setLabel( '→' )
                        .setStyle( ButtonStyle.Success ),
                        new ButtonBuilder()
                        .setCustomId( 'round' )
	                    .setLabel( `${ 35 - parsedData[ "진행" ] }` )
	                    .setStyle( ButtonStyle.Secondary )
	                    .setDisabled( true ) );

                    if ( choice == 3 || ( choice == 0 && future > now ) || ( choice == 1 && future < now ) || ( choice == 2 && future == now ) )
                    {
                        point = 2;
                        combo = 1;

                        if ( choice == 3 )
                        {
                            point = 0;
                            combo = -1;
                        }
                        else if ( choice == 2 )
                        {
                            point = 6;
                        }
                    }
                    else if ( ( choice == 0 && future == now ) || ( choice == 1 && future == now ) )
                    {
                        point = 0;
                        combo = -2;
                    }
                    else
                    {
                        parsedData[ "체력" ] -= 1;
                    }

                    parsedData[ "점수" ] += point;

                    if ( combo == 0 )
                    {
                        parsedData[ "콤보" ] = 0;
                    }
                    else if ( combo == -1 || combo == -2 )
                    {
                        parsedData[ "콤보" ] = parsedData[ "콤보" ];
                    }
                    else
                    {
                        parsedData[ "콤보" ]++;
                    }

                    if ( parsedData[ "콤보" ] > parsedData[ "최고" ] )
                    {
                        parsedData[ "최고" ] = parsedData[ "콤보" ];
                    }

                    ButtonInteraction.deferUpdate();

                    if ( parsedData[ "체력" ] == 0 )
                    {
                        ending = 'ending';
                        const array = JSON.parse( fs.readFileSync( Url ) )[ "배열" ];
                        array[ parsedData[ "현재" ] ] = ':⚫:';

                        const text = ( `패배!\n체력이 0이 되어 패배했어!\n다시 도전해보자!\n\n` 
                        +`${ array.slice( 0, 9 ) }\n`
                        +`${ array.slice( 9, 18 ) }\n`
                        +`${ array.slice( 18, 27 ) }\n`
                        +`${ array.slice( 27, 36 ) }` ).replace( /,/gi, ' ' );
        
                        const Embed = new EmbedBuilder()
                        .setColor( '#7e9091' )
                        .setTitle( '게임' )
                        .setDescription( `${ text }` )
                        .addFields(
                            { name : '현재 패', value : `${ parsedData[ "배열" ][ parsedData[ "현재" ] ] }`, inline: true },
                            { name : '다음 패', value : `${ parsedData[ "배열" ][ parsedData[ "다음" ] ] }`, inline: true },
                            { name : '체력', value : `${ '♡♡♡' }`, inline: true },
                            { name : '점수', value : `${ parsedData[ "점수" ] }`, inline: true },
                            { name : '최고 콤보', value : `x${ parsedData[ "최고" ] }`, inline: true } )
                        .setTimestamp();
        
                        msg.edit( { embeds : [ Embed ] , components : [] } );

                        fs.rm( Url, { recursive: true }, err => {
                            throw err;
                        } );

                        collector.stop()
                    }
                    else if ( parsedData[ "진행" ] == 35 )
                    {
                        ending = 'ending';
                        if ( parsedData[ "점수" ] >= 70 )
                        {
                            const Embed = new EmbedBuilder()
                            .setColor( '#ff0000' )
                            .setTitle( '게임' )
                            .setDescription( `게임 끝!\n70점..... 70점을 넘었어?????\n이정도면 진짜 치튼데.. 너 진짜 쩌는구나?` )
                            .addFields(
                                { name : '최종 점수', value : `${ parsedData[ "점수" ] }`, inline: true },
                                { name : '남은 체력', value : `${ '♥'.repeat( parsedData[ "체력" ] ) }`, inline: true },
                                { name : '최고 콤보', value : `x ${ parsedData[ "최고" ] }`, inline: true }
                            );

                            msg.edit( { embeds : [ Embed ] , components : [] } );
                        }
                        else if ( parsedData[ "점수" ] >= 50 )
                        {
                            const Embed = new EmbedBuilder()
                            .setColor( '#4ca73c' )
                            .setTitle( '게임' )
                            .setDescription( `게임 끝!\n승리했어! 축하해!` )
                            .addFields(
                                { name : '최종 점수', value : `${ parsedData[ "점수" ] }`, inline: true },
                                { name : '남은 체력', value : `${ '♥'.repeat( parsedData[ "체력" ] ) }`, inline: true },
                                { name : '최고 콤보', value : `x ${ parsedData[ "최고" ] }`, inline: true }
                            );

                            msg.edit( { embeds : [ Embed ] , components : [] } );
                        }
                        else
                        {
                            const Embed = new EmbedBuilder()
                            .setColor( '#7e9091' )
                            .setTitle( '게임' )
                            .setDescription( `게임 끝!\n그러나 50점을 못넘겨서 패배야...` )
                            .addFields(
                                { name : '최종 점수', value : `${ parsedData[ "점수" ] }`, inline: true },
                                { name : '남은 체력', value : `${ '♥'.repeat( parsedData[ "체력" ] ) }`, inline: true },
                                { name : '최고 콤보', value : `x ${ parsedData[ "최고" ] }`, inline: true }
                            );

                            msg.edit( { embeds : [ Embed ] , components : [] } );
                        }

                        fs.rm( Url, { recursive: true }, err => {
                            throw err;
                        } );

                        collector.stop()
                    }
                    else
                    {
                        parsedData[ "배열" ][ parsedData[ "현재" ] ] = ':⚫:';
                        parsedData[ "현재" ] = parsedData[ "다음" ];

                        let newNum = parsedData[ "다음" ];
                        while ( newNum == parsedData[ "다음" ] || parsedData[ "배열" ][ newNum ] == ':⚫:' )
                        {
                            newNum = randomNum( 0, 8 ) + randomNum( 0, 3 ) * 9;
                        }
                        parsedData[ "다음" ] = newNum;

                        const data = JSON.stringify( parsedData, null, "\t" );
		    	    	fs.writeFileSync( Url, data );

                        const Embed = hlEmbed( message, point, combo );

                        msg.edit( { embeds : [ Embed ] , components : [ row ] } );
                    } 
                }
		    } );
        
		    collector.on( 'end', collected =>
		    {
                if ( !ending )
		    	{
                    const directory = fs.existsSync( Url )

                    if ( directory )
                    {
                        fs.rm( Url, { recursive: true }, err => {
                            throw err;
                        } );
                    }

                    const Embed = new EmbedBuilder()
                    .setColor( '#7e9091' )
                    .setTitle( '게임' )
                    .setDescription( `시간 초과!\n10분 넘게 못끝냈으면 그냥 패배해....` );

                    msg.edit( { embeds : [ Embed ] , components : [] } );
                }
                else
                {
                    return;
                }
            } );
        }
    }
};