const { TwitterApi } = require('twitter-api-v2');

const striptags = require('striptags');

const decode = (byteArray) => {
  return new TextDecoder().decode(new Uint8Array(byteArray)).replaceAll(/\u0000/g, '');
}

const removeQuotesFromStartAndEndOfString = (string) => {
  return string.substring(1, string.length - 1).substring(-1, string.length - 1);
}

const stripHtmlIfNeeded = (object, value) => {
  let strippedDescription = striptags(object[value], [], ' ');
  strippedDescription = strippedDescription.replace('&nbsp;', ' ');
  if (strippedDescription !== object[value]) {
    object[value+"Html"] = object[value];
    object[value] = removeQuotesFromStartAndEndOfString(strippedDescription);
  }
}

const tweetNewRelease = async (metadata) => {
  try {
    console.log('tweeting new release: ', metadata)
    console.log('should tweet: ', process.env.SHOULD_TWEET_NEW_RELEASES)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    let text = (`${metadata.properties.artist} - "${metadata.properties.title}"`).substr(0, 250)
    text = `${text} ${metadata.external_url}`
    await client.v2.tweet(text);  
  } catch (error) {
    console.warn('error sending new release tweet: ', error, metadata)
  }
}

module.exports = {
  decode,
  stripHtmlIfNeeded,
  tweetNewRelease
}