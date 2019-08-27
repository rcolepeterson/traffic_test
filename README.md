# Traffic Scraper

### function that uses axios and cheerio to go scrape a traffic website.

Website to scrape: https://www.londontraffic.org/

We are targeting the recent updates section.

End point: https://us-central1-testcolepeterson.cloudfunctions.net/traffic

## Notes

If the websoite changes the stucture of the html this will not work.

<!-- "@google-cloud/functions-framework": "^1.2.1", -->

## deploy

https://console.cloud.google.com/functions/details/us-central1/traffic-function?project=testcolepeterson&authuser=1&tab=general&duration=PT1H

`gcloud init`

`gcloud functions deploy traffic-function --runtime nodejs8 --trigger-http --entry-point app`
