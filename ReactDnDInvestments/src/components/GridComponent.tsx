import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ImgItem } from '../interface/imgitems';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DisplayCard from './DisplayCard';
import DisplayLoaderCard from '../shared/components/FreezedDisplayCard';
import update from "immutability-helper";
import './GridComponent.css';
import { Input, InputLabel } from '@mui/material';
import { BallTriangle }from "react-loader-spinner";
import investmentdataService from '../services/investmentdata.service';

export default function BasicGrid() {
  const [cards, setCards] = useState<ImgItem[]>([]);
  const [open, setOpen] = useState<boolean[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [isImgLoadedList, setImgLoadedList] = useState<boolean[]>([]);
  const [selectedFile, setSelectedFile] = useState("Choose File");

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: any) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1, prevCards[hoverIndex]],
          [hoverIndex, 1, prevCards[dragIndex]]
        ]
      })
    );
  }



  const handleImgLoading = (position: any, existingLoadList: any) => {
    let newArr = [...existingLoadList]; // copying the old datas array
    newArr[position] = true; // replace e.target.value with whatever you want to change it to
    setImgLoadedList(newArr);
    return newArr;
  };

  const updateItemList = (index: number, newItem: any, existingItemList: any) => {


    existingItemList.splice(index, 1, newItem)
    setCards(existingItemList);
  }

  useEffect(() => {
    populateImgList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      onSaveDisplay()
    }, 10000);
    return () => clearInterval(interval);
  }, [cards])

  async function onSaveDisplay() {
    const responseList: any[] = [];
    cards.map(({ id, position }, index) => {
      if (position !== index) {
        responseList.push({
          id, prevposition: position, position: index
        })
      }
    });
    if (responseList.length) {
      updateCardPositionsBackend(responseList)
    }
  }


  function updateCardPositions() {
    const newItemList: ImgItem[] = []
    cards.map((item, index) => {
      item.position = index;
      newItemList.push(item);
    });
    setCards(newItemList);
  }

  async function updateCardPositionsBackend(reqBody: any) {

    try{
      setIsLoaded(false);
      const response = await investmentdataService.updateInvestmentList(reqBody)

        if (response.valid) {
          setIsLoaded(true);
          updateCardPositions();
        } else {
          console.log('Invalid Response Received');
          await populateImgList();
        }
    }catch(error){
      console.log(error)
      await populateImgList();
    }
  }

  async function populateImgList() {

    try {
      setIsLoaded(false);
      const items = await investmentdataService.getInvestmentList();
      const existingItemList = items.map((item: any, index: number) => {
        return {
          "id": item.id,
          "type": item.type,
          "title": item.title,
          "position": item.position,
          "thumbnail": ''
        }
      });

      const openList = items.map(() => false);
      setOpen(openList)
      setImgLoadedList(openList);
      setIsLoaded(true);
      setCards(existingItemList);
      let imgLoadedList = openList;
      for (const ele of items) {
        const file = await investmentdataService.getthumbnailbyFileId(ele.thumbnail);
        const fileBlobResp = await file.blob();
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(fileBlobResp);
        // const imageUrl = await blobToBase64(fileBlobResp)
        // items[0].thumbnail =imageUrl;
        const newItem = {
          "id": ele.id,
          "type": ele.type,
          "title": ele.title,
          "position": ele.position,
          "thumbnail": imageUrl
        }

        updateItemList(ele.position, newItem, existingItemList);
        imgLoadedList = handleImgLoading(ele.position, imgLoadedList)
      }
    }
    catch (error) {
      console.log(error);
    }

  }



  async function submitForm(event: any) {
    event.preventDefault()
    const formData = new FormData();
    const position = cards.length
    formData.append('thumbnail', selectedFile);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('position', position.toString());
    setOpenForm(false);

    try {
      setIsLoaded(false)
      await investmentdataService.postInvestment(formData);
      setIsLoaded(true)
      await addNewImageToList(position)

    } catch (error) {
      console.log(error);
      await populateImgList();
    }
  }
  async function addNewImageToList(position: number) {
    try {
      const item = await investmentdataService.getInvestmentByPosition(position);
      const newItem = {
        "id": item.id,
        "type": item.type,
        "title": item.title,
        "position": item.position,
        "thumbnail": ''
      }
      setOpen([...open, false])
      setImgLoadedList([...isImgLoadedList, false]);
      setCards([...cards, newItem])
      const file = await investmentdataService.getthumbnailbyFileId(item.thumbnail)
      const fileBlobResp = await file.blob();
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(fileBlobResp);
      const updatedItem = {
        ...newItem,
        "thumbnail": imageUrl
      }

      updateItemList(item.position, updatedItem, cards);
      handleImgLoading(item.position, isImgLoadedList);
    } catch (error) {
      console.log(error);
    }
  }


    return   isLoaded ? (

      <div className="App">
        <header className="App-header">
          <h1>Final Data Display</h1>

          <Box sx={{ flexGrow: 0.5 }}>

            <Grid container spacing={2} >
              {cards.map((card, index) => {
                if (isImgLoadedList[index]) {
                  return (<DisplayCard
                    key={card.position.toString()}
                    index={index}
                    type={card.type}
                    title={card.title}
                    position={card.position}
                    thumbnail={card.thumbnail}
                    moveCard={moveCard}
                    openList={open}
                  />)
                }
                else {
                  return (
                    <DisplayLoaderCard
                    key={card.position.toString()}
                    type={card.type}
                    title={card.title}
                    position={card.position}
                    />
                  )
                }
              })
              }
            </Grid>
          </Box>
          <Box m={1} pt={2}>
            {/* <Button onClick={() => onSaveDisplay()}>Save Display</Button> */}
            <Button onClick={() => setOpenForm(true)}>Add Item</Button>



            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
              <form onSubmit={submitForm}>
                <DialogTitle>Investment Form</DialogTitle>
                <DialogContent>
                  <Grid container direction={"column"} spacing={3}>
                    <Grid item>
                      <Input
                        autoFocus
                        margin="dense"
                        id="type"
                        placeholder="Type"
                        type="text"
                        fullWidth
                        required
                        onChange={(event) => setType(event.target.value)}

                      />
                    </Grid>
                    <Grid item>
                      <Input
                        autoFocus
                        margin="dense"
                        id="title"
                        placeholder="Title"
                        type="text"
                        fullWidth
                        required
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <InputLabel>
                        Select Thumbnail Image
                      </InputLabel>
                      <Input
                        autoFocus
                        margin="dense"
                        id="thumbnail"
                        type="file"
                        fullWidth
                        required
                        onChange={(event: any) => setSelectedFile(event.target.files[0])}
                      />
                    </Grid>
                  </Grid>



                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box> 
        </header>
      </div >

    ) :    <div className='loader'>
    <BallTriangle 
      color="#00BFFF"
      height={100}
      width={100}
    />
  </div>


}
