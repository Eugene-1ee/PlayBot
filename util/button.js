const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require( 'discord.js' );

/**
 * 2페이지 이하의 대기열 버튼
 * @param {} interaction
 * @param { number } now 현재 페이지
 * @returns 버튼
 */
function Buttonpage2( interaction, now )
{
    let row;
    if ( now == 0 )
    {
        row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId( '1' )
            .setLabel( '◀' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( '2' )
            .setLabel( '▶' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( 'InteractionUserName' )
            .setLabel( `Requested by @${interaction.user.username}` )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ) );
    }
    else
    {
        row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId( '1' )
            .setLabel( '◀' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '2' )
            .setLabel( '▶' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( 'InteractionUserName' )
            .setLabel( `Requested by @${interaction.user.username}` )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ) );
    }
    return row;
}

/**
 * 3페이지 이상의 대기열 버튼
 * @param {} interaction
 * @param { number } now 현재 페이지
 * @param { number } max 최고 페이지
 * @returns 버튼
 */
function pagemore( interaction, now, max )
{
    let row;
    if ( now == 0 )
    {
        row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId( '0' )
            .setLabel( '◀◀' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( '1' )
            .setLabel( '◀' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( '2' )
            .setLabel( '▶' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '3' )
            .setLabel( '▶▶' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( 'InteractionUserName' )
            .setLabel( `Requested by @${interaction.user.username}` )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ) );
    }
    else if ( now == max - 1 )
    {
        row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId( '0' )
            .setLabel( '◀◀' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '1' )
            .setLabel( '◀' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '2' )
            .setLabel( '▶' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( '3' )
            .setLabel( '▶▶' )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ),
            new ButtonBuilder()
            .setCustomId( 'InteractionUserName' )
            .setLabel( `Requested by @${interaction.user.username}` )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ) );
    }
    else
    {
        row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId( '0' )
            .setLabel( '◀◀' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '1' )
            .setLabel( '◀' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '2' )
            .setLabel( '▶' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( '3' )
            .setLabel( '▶▶' )
            .setStyle( ButtonStyle.Secondary ),
            new ButtonBuilder()
            .setCustomId( 'InteractionUserName' )
            .setLabel( `Requested by @${interaction.user.username}` )
            .setStyle( ButtonStyle.Secondary )
            .setDisabled( true ) );
    }
    return row;
}

/**
 * 검색 버튼 생성기
 * @param {} interaction
 * @returns 버튼
 */
function searchButton( interaction )
{
    const row = [] 
    row[0] = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId( '1' )
        .setLabel( '1' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '2' )
        .setLabel( '2' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '3' )
        .setLabel( '3' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '4' )
        .setLabel( '4' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '5' )
        .setLabel( '5' )
        .setStyle( ButtonStyle.Secondary ) );

    row[1] = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId( '6' )
        .setLabel( '6' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '7' )
        .setLabel( '7' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '8' )
        .setLabel( '8' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '9' )
        .setLabel( '9' )
        .setStyle( ButtonStyle.Secondary ),
        new ButtonBuilder()
        .setCustomId( '10' )
        .setLabel( '10' )
        .setStyle( ButtonStyle.Secondary ) );

    row[2] =  new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId( 'cancel' )
        .setLabel( '취소' )
        .setStyle( ButtonStyle.Danger ),
        new ButtonBuilder()
        .setCustomId( 'InteractionUserName' )
        .setLabel( `Requested by @${interaction.user.username}` )
        .setStyle( ButtonStyle.Secondary )
        .setDisabled( true ) );
    
    return row;
}

module.exports =
{
    Buttonpage2: Buttonpage2,
    pagemore: pagemore,
    searchButton: searchButton
};