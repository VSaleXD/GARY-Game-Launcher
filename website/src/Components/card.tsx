type CardProps = {
    image: string;
    title: string;
    description: string;
};

const Card = (props: CardProps) => {
    return (
        <div className="card">
            <img src={props.image} alt={props.title} />
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </div>
    );
};

export default Card;