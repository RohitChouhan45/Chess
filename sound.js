export class SoundManager {
  constructor() {
    this.moveSound = new Audio('data:audio/wav;base64,UklGRh4DAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQADAAD+//3//f/+//3//P/9//3//f/9//7//////////v//////');
    
    // Extended victory fanfare
    this.winSound = new Audio('data:audio/wav;base64,UklGRlQEAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQAEAAB/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=');
    
    // Sad trombone for losing
    this.loseSound = new Audio('data:audio/wav;base64,UklGRh4DAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQADAACjo6OhoaGfn5+dnZ2bm5uZmZmXl5eVlZWTk5ORkZGPj4+NjY2Li4uJiYmHh4eFhYWDg4OCgoKAgIB+fn58fHx6enp4eHh2dnZ0dHRycnJwcHBubm5sbGxqamppaWlnZ2dlZWVjY2NhYWFfX19dXV1bW1tZWVlXV1dVVVVTU1NRUVFPTk5MTExKSkpISEhGRkZERERCQkJAQEA+Pj48PDw6Ojo4ODg2NjY0NDQzMzMxMTEvLy8tLS0rKysqKiooKCgmJiYkJCQiIiIgICAeHh4cHBwaGhoYGBgWFhYUFBQSEhIQEBBKSkpMTExOTk5QUFBSUlJUVFRWVlZYWFhaWlpcXFxeXl5gYGBiYmJkZGRmZmZoaGhqampsbGxubm5wcHBycnJ0dHR2dnZ4eHh6enp8fHx+fn6AgICCgoKEhISGhoaIiIiKioqMjIyOjo6QkJCSkpKUlJSWlpaYmJiampqcnJyenp6goKCioqKkpKSmpqaoqKiqqqqsrKyurq6wsLCysrK0tLS2tra4uLi6urq8vLy+vr7AwMDCwsLExMTGxsbIyMjKysrMzMzOzs7Q0NDPz8/Nzc3MzMzKysrIyMjGxsbExMTCwsLAwMC+vr68vLy6urq4uLi2trY=');
    
    // Capturing piece sound effect
    this.captureSound = new Audio('data:audio/wav;base64,UklGRh4DAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQADAABmZmZ2dnaCgoKOjo6YmJigoKClpaWoqKipqamqqqqpqamnp6ekpKSgoKCcnJyYmJiUlJSQkJCMjIyIiIiEhISBgYF9fX15eXl2dnZycnJvb29ra2toaGhlZWViYmJfX19cXFxZWVlWVlZTU1NQUFBNTExKSkpHR0dERERBQUE+Pj47Ozs4ODg1NTUzMzMwMDAtLS0qKiooKCglJSUiIiIgICAdHR0bGxsYGBgWFhYTExMREREPDw8MDAwKCgoICAgGBgYEBAQCAgIAAAAAAAACAgIEBAQGBgYICAgKCgoMDAwPDw8REREUFBQWFhYZGRkbGxseHh4gICAdHR0aGhoXFxcUFBQREREODg4LCwsICAgFBQUCAgL///////////////////////////////////////////8=');
  }

  playMove() {
    this.moveSound.play().catch(e => console.log('Error playing move sound:', e));
  }

  playCapture() {
    this.captureSound.play().catch(e => console.log('Error playing capture sound:', e));
  }

  playWin() {
    this.winSound.play().catch(e => console.log('Error playing win sound:', e));
  }

  playLose() {
    this.loseSound.play().catch(e => console.log('Error playing lose sound:', e));
  }
}