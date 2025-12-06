import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
const foodDB: any = {
  // 🥩 MEAT
  chicken: { protein: 31, carbs: 0, fiber: 0 },
  mutton: { protein: 25, carbs: 0, fiber: 0 },
  pork: { protein: 27, carbs: 0, fiber: 0 },
  duck: { protein: 19, carbs: 0, fiber: 0 },

  // 🐟 FISH
  fish: { protein: 22, carbs: 0, fiber: 0 },
  rohu: { protein: 23, carbs: 0, fiber: 0 },
  katla: { protein: 21, carbs: 0, fiber: 0 },

  // 🥚 DAIRY
  egg: { protein: 13, carbs: 1, fiber: 0 },
  milk: { protein: 3.2, carbs: 5, fiber: 0 },
  paneer: { protein: 18, carbs: 3, fiber: 0 },

  // 🌾 GRAINS
  rice: { protein: 2.7, carbs: 28, fiber: 0.4 },
  corn: { protein: 3.4, carbs: 19, fiber: 2.7 },
  oats: { protein: 13.5, carbs: 67, fiber: 10 },

  // 🥦 VEGETABLES
  spinach: { protein: 2.9, carbs: 3.6, fiber: 2.2 },
  broccoli: { protein: 2.8, carbs: 7, fiber: 2.6 },
  cauliflower: { protein: 1.9, carbs: 5, fiber: 2 },
  carrot: { protein: 0.9, carbs: 10, fiber: 2.8 },
  tomato: { protein: 0.9, carbs: 4, fiber: 1.2 },

  // 🍎 FRUITS
  apple: { protein: 0.3, carbs: 14, fiber: 2.4 },
  banana: { protein: 1.1, carbs: 23, fiber: 2.6 },
  guava: { protein: 2.6, carbs: 14, fiber: 5.4 },
  orange: { protein: 0.9, carbs: 12, fiber: 2.4 },

  // 🥜 NUTS & SEEDS
  peanut: { protein: 26, carbs: 16, fiber: 9 },
  almond: { protein: 21, carbs: 22, fiber: 12 }
};

export default function App() {
  const HEIGHT_CM = 180;
  const DEFAULT_PROTEIN = 160;

  const [mode, setMode] = useState("Fat Loss");
  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [foodName, setFoodName] = useState("");
const [foodWeight, setFoodWeight] = useState("");


  let foodResult = null;

if (foodName && foodWeight && foodDB[foodName.toLowerCase()]) {
  const per100 = foodDB[foodName.toLowerCase()];

  foodResult = {
    protein: ((per100.protein * Number(foodWeight)) / 100).toFixed(1),
    carbs: ((per100.carbs * Number(foodWeight)) / 100).toFixed(1),
    fiber: ((per100.fiber * Number(foodWeight)) / 100).toFixed(1)
  };
}

  const [history, setHistory] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem("fitness") || "[]");
  });

  const [workout, setWorkout] = useState("");
  const [meal, setMeal] = useState("");

  // ✅ Dynamic Targets
  const proteinGoal = weight ? weight * 2 : DEFAULT_PROTEIN;

  const bmr = weight
    ? (10 * weight + 6.25 * HEIGHT_CM - 5 * 28 + 5)*1.45 // age auto assumed 28 (safe default)
    : 2700;

  const calorieGoal = mode === "Fat Loss" ? bmr - 500 : bmr + 300;

  const saveData = () => {
    if (!protein || !calories || !weight) return;

    const newData = {
      date: new Date().toLocaleDateString(),
      protein,
      calories,
      weight,
    };

    const updated = [...history, newData];
    setHistory(updated);
    localStorage.setItem("fitness", JSON.stringify(updated));
  };

  // ✅ Status Only When Value Exists
  const proteinStatus =
    protein === null
      ? ""
      : protein < proteinGoal -30
      ? "❌ Protein Too Low"
      : protein > proteinGoal + 30
      ? "⚠ Protein Too High"
      : "✅ Protein Perfect";

  const calorieStatus =
    calories === null
      ? ""
      : calories < calorieGoal - 300
      ? "❌ Calories Too Low"
      : calories > calorieGoal + 300
      ? "⚠ Calories Too High"
      : "✅ Calories Perfect";

  const proteinPercent = protein ? Math.min(100, (protein / proteinGoal) * 100) : 0;
  const caloriePercent = calories ? Math.min(100, (calories / calorieGoal) * 100) : 0;

  const saveAsPDF = async () => {
    const element = document.querySelector(".app") as HTMLElement;
    if (!element) return;
  
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
  
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("fitness-report.pdf");
  };

  return (
    <div style={{ padding: 15, fontFamily: "sans-serif", maxWidth: 500, margin: "auto" }}>
      <button
  onClick={() => alert("Last 30 Days Data Here")}
  style={{
    position: "fixed",
    top: "16px",
    right: "16px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    border: "none",
    fontSize: "20px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1000,
  }}
>
  📊
</button>

      {/* ✅ Header Image */}
      <img
        src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg"
        style={{ width: "30%", borderRadius: 90, marginBottom: 10, marginLeft:150 }}
      />

      <h1>Sagnik's Fitness Tracker</h1>

      {/* MODE */}
      <select onChange={(e) => setMode(e.target.value)} value={mode}>
        <option>Fat Loss</option>
        <option>Muscle Gain</option>
      </select>

      {/* INPUTS */}
      <input placeholder="Protein (g)" type="number" value={protein ?? ""} onChange={(e) => setProtein(e.target.value ? +e.target.value : null)} />
      <input placeholder="Carbs (g)" type="number" value={carbs ?? ""} onChange={(e) => setCarbs(e.target.value ? +e.target.value : null)} />
      <input placeholder="Calories (kcal)" type="number" value={calories ?? ""} onChange={(e) => setCalories(e.target.value ? +e.target.value : null)} />
      <input placeholder="Weight (kg)" type="number" value={weight ?? ""} onChange={(e) => setWeight(e.target.value ? +e.target.value : null)} />

      <button onClick={saveData}>✅ Save Today's Data</button>

      {/* ✅ Animated Progress Bars */}
      <h3>Protein Target: {Math.round(proteinGoal)} g</h3>
      <div style={{ background: "#222", borderRadius: 20, overflow: "hidden" }}>
        <motion.div
          animate={{ width: '${proteinPercent}%' }}
          style={{ height: 18, background: "linear-gradient(to right, #22c55e, #16a34a)" }}
        />
      </div>

      <h3>Calorie Target: {Math.round(calorieGoal)} kcal</h3>
      <div style={{ background: "#222", borderRadius: 20, overflow: "hidden" }}>
        <motion.div
          animate={{ width: '${caloriePercent}%' }}
          style={{ height: 18, background: "linear-gradient(to right, #38bdf8, #0ea5e9)" }}
        />
      </div>

      {/* ✅ Dynamic Status (Only on input) */}
      {protein !== null && <h3>{proteinStatus}</h3>}
      {calories !== null && <h3>{calorieStatus}</h3>}

      {/* WORKOUT */}
      <h2>🏋 Workout Tracker</h2>
      <input placeholder="Today's Workout" value={workout} onChange={(e) => setWorkout(e.target.value)} />
      <p>✅ {workout}</p>

      {/* MEAL */}
      <h2>🍱 Meal Planner</h2>
      <input placeholder="Today's Meal Plan" value={meal} onChange={(e) => setMeal(e.target.value)} />
      <p>✅ {meal}</p>

      <div style={{
  background: "rgba(255,255,255,0.15)",
  padding: "16px",
  borderRadius: "16px",
  marginTop: "20px"
}}>
  <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
    🍗 Food Macro Calculator
  </h3>

  <input
    placeholder="Food name (chicken, egg, rice...)"
    value={foodName}
    onChange={(e) => setFoodName(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  />

  <input
    placeholder="Food weight (grams)"
    value={foodWeight}
    onChange={(e) => setFoodWeight(e.target.value)}
    type="number"
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "12px"
    }}
  />

  {foodResult && (
    <div style={{
      background: "#00000055",
      padding: "12px",
      borderRadius: "12px"
    }}>
      <p>✅ Protein: <b>{foodResult.protein} g</b></p>
      <p>✅ Carbs: <b>{foodResult.carbs} g</b></p>
      <p>✅ Fiber: <b>{foodResult.fiber} g</b></p>
    </div>
  )}
</div>


      {/* CHART */}
      <h2>📈 Progress Chart</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" strokeWidth={3} />
            <Line type="monotone" dataKey="calories" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button className="pdf-btn" onClick={saveAsPDF}>
  📄 Save Report as PDF
</button>
{showHistory && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999
    }}
  >
    <div
      style={{
        background: "#fff",
        width: "90%",
        maxHeight: "80%",
        overflowY: "auto",
        borderRadius: 12,
        padding: 20
      }}
    >
      <h2>📊 Last 30 Days Data</h2>

      {savedData.length === 0 && <p>No data found.</p>}

      {savedData.slice(-30).map((item: any, i: number) => (
        <div
          key={i}
          style={{
            padding: 10,
            marginBottom: 8,
            borderRadius: 8,
            background: "#f3f4f6"
          }}
        >
          <b>Date:</b> {item.date} <br />
          🥩 Protein: {item.protein}g | 🔥 Calories: {item.calories} | ⚖ Weight: {item.weight}kg
        </div>
      ))}

      <button
        onClick={() => setShowHistory(false)}
        style={{
          marginTop: 15,
          padding: "8px 14px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: 8
        }}
      >
        ❌ Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}