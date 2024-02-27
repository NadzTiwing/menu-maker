import { ReactElement, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ModeIcon from "@mui/icons-material/Mode";
import CloseIcon from "@mui/icons-material/Close";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import { IItem, IItemWithOptions } from "../types";
import PopupMessage from "./PopupMessage";
import EditItemModal from "./EditItemModal";

const CardItems: React.FC = (): ReactElement => {
  const [items, setItems] = useState<IItem[] | IItemWithOptions[]>([]);
  const [isOpenAlert, setOpenAlert] = useState<boolean>(false);
  const [isOpenEditModal, setOpenEditModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editItem, setEditItem] = useState<IItem | IItemWithOptions | null>(null);
  const itemsRef = ref(db, "items/");

  const handleShowAlert = () => {
    setOpenAlert(!isOpenAlert);
  };

  const handleDeleteItem = async (itemId: string) => {
    if(confirm("Are you sure?")) {
      await remove(ref(db, 'items/' + itemId));
      setMessage("Successfully deleted!");
      setOpenAlert(true);
    }
  };

  const handleShowModal = () => {
    setOpenEditModal(!isOpenEditModal);
  };

  const handleEditItem = (item: IItem | IItemWithOptions) => {
    setEditItem(item);
    handleShowModal();
  };

  const getCategoryName = (categoryId: string): string => {
    let name = "";
    onValue(ref(db, "categories/" + categoryId), (snapshot) => {
      const categoriesObj = snapshot.val() || {};
      name = categoriesObj.name; 
    });

    return name || "";
  };

  useEffect(() => {

    onValue(itemsRef, (snapshot) => {
      const itemsObj = snapshot.val() || {};
      const itemsArray: IItem[] | IItemWithOptions = Object.keys(itemsObj).map((key) => {
        const itemId = key as string;
        const categoryId = itemsObj[key].categoryId as string;
        const category = {
          id: categoryId,
          name: getCategoryName(categoryId) // Ensure this returns a string synchronously
        };
        
        if (itemsObj[key].options) {
          return {
            id: itemId,
            name: itemsObj[key].name,
            category: category,
            options: itemsObj[key].options || [],
          } as IItemWithOptions;
        } else { 
          return {
            id: itemId,
            name: itemsObj[key].name,
            category: category,
            price: itemsObj[key].price,
            cost: Number(itemsObj[key].cost) || 0,
            stock: Number(itemsObj[key].stock) || 0,
          } as IItem; 
        }
      });

      setItems(itemsArray);
    });

    
  }, []);

  return (
    <>
    <PopupMessage isOpen={isOpenAlert} handleShow={handleShowAlert} message={message}/>
    <EditItemModal isOpen={isOpenEditModal} handleShow={handleShowModal} details={editItem}/>
      {items.map((item) => (
        <Box key={`card-item-${item.id}`} className="card-item">
          <Card variant="outlined">
            <CardContent>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <CardActions
                    sx={{ alignItems: "flex-end", justifyContent: "flex-end" }}
                  >
                    <Button
                      size="small"
                      sx={{
                        color: "lightgray",
                        "&:hover": { color: "darkblue" },
                      }}
                      onClick={()=>handleEditItem(item)}
                    >
                      <ModeIcon />
                    </Button>
                    <Button
                      size="small"
                      sx={{ color: "lightgray", "&:hover": { color: "red" } }}
                      onClick={()=>handleDeleteItem(item.id)}
                    >
                      <CloseIcon />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
              <Typography variant="body1">
                <span className="text-muted">Category:</span>{" "}
                <span className="text-bold">{item.category.name}</span>
                <br />
              </Typography>
              {(item as IItemWithOptions).options ?
                (item as IItemWithOptions).options.map((option) => (
                  <Box key={option.id} className="amount-details">
                    <Typography variant="body1">
                      <span className="text-muted">Type:</span>{" "}
                      <span className="text-bold">{option.name}</span>
                    </Typography>
                    <Typography variant="body1">
                      <span className="text-muted">Price:</span>{" "}
                      <span className="text-bold">{option.price}</span>
                    </Typography>
                    <Typography variant="body1">
                      <span className="text-muted">Cost:</span>{" "}
                      <span className="text-bold">{option.cost}</span>
                    </Typography>
                    <Typography variant="body1">
                      <span className="text-muted">Amount in stock:</span>{" "}
                      <span className="text-bold">{option.stock}</span>
                    </Typography>
                </Box>
                ))
              :
              (<Box className="amount-details">
                <Typography variant="body1">
                  <span className="text-muted">Price:</span>{" "}
                  <span className="text-bold">{item.price}</span>
                </Typography>
                <Typography variant="body1">
                  <span className="text-muted">Cost:</span>{" "}
                  <span className="text-bold">{item.cost}</span>
                </Typography>
                <Typography variant="body1">
                  <span className="text-muted">Amount in stock:</span>{" "}
                  <span className="text-bold">{item.stock}</span>
                </Typography>
              </Box>)
              }
            </CardContent>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default CardItems;
