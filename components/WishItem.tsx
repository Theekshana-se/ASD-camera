import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

const WishItem = ({ title, price, image, slug, stockAvailabillity }: Props) => {
  return (
    <tr>
      <th></th>
      <td>
        <Image src={image || "/placeholder.png"} alt={title} width={64} height={64} className="w-16 h-16 object-cover" />
      </td>
      <td>
        <Link href={`/shop/${slug}`} className="link link-hover">
          {title}
        </Link>
      </td>
      <td>{stockAvailabillity > 0 ? "In Stock" : "Out of Stock"}</td>
      <td>
        <Link href={`/shop/${slug}`} className="btn btn-sm">View</Link>
      </td>
    </tr>
  );
};

export default WishItem;