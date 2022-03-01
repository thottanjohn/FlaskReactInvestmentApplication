import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import loaderimg from '../../assets/loading.gif';
import { Item } from "../styles/CustomStyles";
export default function DisplayLoaderCard({ type, title, position }: any) {
    
    return (
        <Grid item xs={4} key={position.toString()}>
                      <Item >
 
                      <Card square={true} >
                        <CardMedia
                          component="img"
                          src={loaderimg}
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
                    </Grid>
    )
  }