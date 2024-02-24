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
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy as orderByFS,
  onSnapshot,
  DocumentReference,
  deleteDoc,
} from "firebase/firestore";
import { IItem, IItemWithOptions } from "../types";
import PopupMessage from "./PopupMessage";
import EditItemModal from "./EditItemModal";

const CardItems: React.FC = (): ReactElement => {
  const [items, setItems] = useState<IItem[] | IItemWithOptions[]>([]);
  const [isOpenAlert, setOpenAlert] = useState<boolean>(false);
  const [isOpenEditModal, setOpenEditModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editItem, setEditItem] = useState<string>("");

  const handleShowAlert = () => {
    setOpenAlert(!isOpenAlert);
  };

  const handleDeleteItem = async (itemId: string) => {
    if(confirm("Are you sure?")) {
      await deleteDoc(doc(db, "items", itemId));
      setMessage("Successfully deleted!");
      setOpenAlert(true);
    }
  };

  const handleShowModal = () => {
    setOpenEditModal(!isOpenEditModal);
  };

  const handleEditItem = (itemId: string) => {
    setEditItem(itemId);
    handleShowModal();
  };

  const getCategoryName = async (categoryId: string): Promise<any> => {
    const categoriesRef = collection(db, "categories");
    const categoryDocRef = doc(categoriesRef, categoryId);
    const categoryDocSnapshot = await getDoc(categoryDocRef);

    if (categoryDocSnapshot.exists()) {
      return categoryDocSnapshot.data().name;
    }

    return "";
  };

  useEffect(() => {
    const fetchQuery = query(collection(db, "items"), orderByFS("name", "asc"));

    const unsubscribe = onSnapshot(fetchQuery, async (QuerySnapshot) => {
      const fetchedItems: IItem[] | IItemWithOptions[] = [];
      const docsArray = QuerySnapshot.docs;
      await Promise.all(
        docsArray.map(async (doc) => {
          try {
            const categoryId = doc.data().categoryId;
            const categoryName = await getCategoryName(categoryId);
            const { cost, name, stock, options } = doc.data();
            fetchedItems.push({
              id: doc.id,
              category: { name: categoryName, id: categoryId },
              name,
              cost,
              stock,
              options
            });
          } catch (error) {
            console.error("Error fetching category name:", error);
          }
        })
      );

      console.log("fetchedItems", fetchedItems);
      setItems(fetchedItems);
    });

    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <>
    <PopupMessage isOpen={isOpenAlert} handleShow={handleShowAlert} message={message}/>
    <EditItemModal isOpen={isOpenEditModal} handleShow={handleShowModal} id={editItem}/>
      {items.map((item) => (
        <Box key={item.id} className="card-item">
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
                      onClick={()=>handleEditItem(item.id)}
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
                  <Box className="amount-details">
                    <Typography variant="body1">
                      <span className="text-muted">Name:</span>{" "}
                      <span className="text-bold">{option.name}</span>
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
