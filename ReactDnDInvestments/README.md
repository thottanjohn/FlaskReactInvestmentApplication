# Title
React UI to Load The Investments with thumbnails

# Functional Description
1. When the application loads, It will call GET /v1/investment endpoint to get the list of all investments .
2. After this api call is completed the Ui page will show each investment  with loader spinner thumbnail and will be freezed.
3. Now for each investment fetched GET /v1/investment endpoint it will fetch the image for the investment using GET /v1/file/{fileid} endpoint and will load the image on each one by one when api response is successful.
4. After the image is loaded for card investment .If you click on that image .It will show the image in an opened modal component.If you click of Esc key the image will be closed.
5. It is possible to rearrange the investment card from one position to another position .You can click and drag one card and place it in required position. I used react-dnd package for this functionality.
6. At every 5 seconnds an endpoint /v1/updateinvestments will be called if there is any rearrangement happened in UI and update the same in backend. If api is successful ,the UI will permanently update image positions without refresh.
7. To add new investment type to backend ,you can click on add button . A modal form will appear where you can fill in the details and once you click on save ,It will get assigned the last position in UI automatically based on number of cards currently present and endpoint /v1/investment will be called to save the new investment in DB.
8. Soon after  /v1/investment is called and is successful .It will call /v1/investment/{position} to get the latest added investment card and reflect in UI.
9. To handle real time scenarios ,If two or more  persons are adding investments / rearranging investment cards .The person whose request reaches the DB first will be successful. For the rest of the people the api will fail and UI will refresh to get the latest cards / card arrangements.

# Architectural Description
1. AppComponent contain DND proveder which encloses Grid Component show all data in UI
2. Inside Grid Component ,we have heading section , Display Section ,Add Section and Loader Component.
3. Grid Component use Investment Data Service to make api calls
4. Display Section is done using Display Card Component which handles all drag and drop logic and rearranges the card.
5. There is FreezeDisplayCard Component which will show the spinner image as placeholder for not loaded images.
6. Most UI component are @mui/material to reduce the effort in CSS.
7. Grid Component also contains setTimeout function to trigger the api call if there is change in order
8. For Most of the expensive api calls Loader will shown until api is completed

# How to start
1. Open a terminal
2. npm i
3. npm run start
4. Ui will be running at port 3000 by default



# Enhancements That can be Done
