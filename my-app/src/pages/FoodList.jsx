import { useParams } from "react-router-dom";
import FoodList from "../pages/FoodPage";

export default function FoodPage() {
  const { shopId } = useParams();
  return <FoodList shopId={shopId} />;
}