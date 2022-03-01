
import { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const ModalImgStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  bgcolor: 'background.paper',
  transform: 'translate(-50%, -50%)',
  border: '2px solid #000',
  boxShadow: 14,
  p: 1,
};
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function DisplayCard({ index, type, title, position, thumbnail, moveCard, openList }: any) {
  const ref = useRef(null);
  const [open, setOpen] = useState<boolean[]>(openList);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    drop(item: any) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      console.log(dragIndex, hoverIndex);

      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { position, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })



  const handleOpen = (position: any) => {
    let newArr = [...open]; // copying the old datas array
    newArr[position] = true; // replace e.target.value with whatever you want to change it to
    setOpen(newArr)
  };
  const handleClose = (position: any) => {
    let newArr = [...open]; // copying the old datas array
    newArr[position] = false // replace e.target.value with whatever you want to change it to
    setOpen(newArr)
  };

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
      <Grid item ref={ref}  xs={4}  style={{ opacity }} > 
      <Item onClick={() => handleOpen(position)} >

        <Card square={true} >
          <CardMedia
            component="img"
            src={`${thumbnail}`}
            srcSet={`${thumbnail}`}
            loading="lazy"
            height="350"
            className="display-img"
            // image={thumbnail}
            alt={type}
          />
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
          </CardContent>
        </Card>
      </Item>

      <Modal
        open={open[position]}
        onClose={() => handleClose(position)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalImgStyle}>
          <img className="modal-img" src={thumbnail} alt={`${position} Thumb`} />
        </Box>
      </Modal>

    </Grid>
  )
}

