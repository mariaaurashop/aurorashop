import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.cluster import KMeans
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.feature_extraction.text import TfidfVectorizer

users = pd.read_csv("users.csv", encoding="latin1")
print(f"Users data: {users.shape[0]} rows, {users.shape[1]} columns")

items = pd.read_csv("items2.csv", sep=';', encoding="latin1")
print(f"Raw items data: {items.shape[0]} rows")

items['price'] = items['price'].str.replace(',', '.').astype(float)

items = items.drop_duplicates(subset='item_id')
print(f"Unique items after deduplication: {items.shape[0]} rows")

interactions = pd.read_csv("interactions.csv", encoding="latin1")
print(f"Interactions data: {interactions.shape[0]} rows")

# --------------------
# Data Integration
# --------------------

data = pd.merge(interactions, items, on="item_id", how="left")

data = pd.merge(data, users, on="user_id", how="left")
print(f"uniendo datasets: {data.shape}")

print("\nejemplo:")
print(data.head(3))

# --------------------
# Data Quality Check
# --------------------
initial_count = data.shape[0]
data = data.dropna(subset=['name', 'category', 'brand', 'price', 'age', 'gender'])
print(f"Removed {initial_count - data.shape[0]} rows with missing values")

# --------------------
# Feature Engineering 
# --------------------
print("\nProcessing text features using TF-IDF...")
tfidf = TfidfVectorizer(lowercase=True, stop_words='english')
name_features = tfidf.fit_transform(data['name'])

feature_names = tfidf.get_feature_names_out()
name_df = pd.DataFrame(name_features.toarray(), columns=feature_names)

data = pd.concat([data.reset_index(drop=True), name_df], axis=1)
data = data.drop(columns=['name'])
data["timestamp"] = pd.to_datetime(data["timestamp"])
data["hour"] = data["timestamp"].dt.hour
data["day_of_week"] = data["timestamp"].dt.dayofweek
data["month"] = data["timestamp"].dt.month
data = data.drop(columns=["timestamp"])

le = LabelEncoder()
data["action_type_encoded"] = le.fit_transform(data["action_type"])
print(f"Action type mappings: {dict(zip(le.classes_, range(len(le.classes_)))}")

categorical_cols = ["category", "brand", "color", "size", "gender", "location"]
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

# --------------------
# preparando modelo de datos
# --------------------
X = data.select_dtypes(include=[np.number])
y = data["action_type_encoded"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
# --------------------
# modelo de arbol de desiciones
# --------------------
print("\nTraining Decision Tree...")
tree = DecisionTreeClassifier(max_depth=5, random_state=42)
tree.fit(X_train, y_train)
pred_tree = tree.predict(X_test)

print("\nDecision Tree Performance:")
print(classification_report(y_test, pred_tree, target_names=le.classes_))

# --------------------
# modelo de red neuronal
# --------------------
model = Sequential([
    Dense(128, activation="relu", input_shape=(X_train.shape[1],)),
    Dense(64, activation="relu"),
    Dense(len(le.classes_), activation="softmax")
])

model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

print("Training Neural Network...")
history = model.fit(X_train, y_train, 
                    epochs=20, 
                    batch_size=32,
                    validation_split=0.2,
                    verbose=1)

# Evaluate model
test_loss, test_acc = model.evaluate(X_test, y_test)

# Plot training history
plt.figure(figsize=(10, 5))
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('progeso')
plt.xlabel('Epoca')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig('accuracy_plot.png', dpi=300)
plt.show()

# --------------------
# K-Means Clustering
# --------------------
numeric_data = data.select_dtypes(include=[np.number])
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(numeric_data[["price", "age"]])

# Visualizacion
plt.figure(figsize=(10, 6))
plt.scatter(numeric_data["price"], numeric_data["age"], 
            c=clusters, cmap='viridis', alpha=0.6)
plt.title("cliente segmentacion por edad y gastos")
plt.xlabel("Precio")
plt.ylabel("edad")
plt.colorbar(label='Cluster ID')
plt.grid(True)
plt.tight_layout()
plt.savefig('clusters.png', dpi=300)
plt.show()

print("\nAnalysis complete!")