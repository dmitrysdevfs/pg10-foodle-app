import css from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>PG10-Foodle 🍲</h1>
      <p className={css.subtitle}>All Recipes</p>
      <div className={css.content}>
        <p>Recipe list will be here</p>
      </div>
    </div>
  );
} 