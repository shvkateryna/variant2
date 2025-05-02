import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

export default function HomePage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getColortypeLabel = (code: string | number | null): string | null => {
    const value = String(code);
    switch (value) {
      case "0": return "Autumn 🍂";
      case "1": return "Summer 🌸";
      case "2": return "Winter ❄️";
      case "3": return "Spring 🌼";
      default: return null;
    }
  };

  const getRecommendationLinks = (code: string | number | null): [string, string] | null => {
    const value = String(code);
    switch (value) {
      case "0":
        return [
          "https://unicoukraine.com/products/brownie",
          "https://unicoukraine.com/products/multitasker-sense"
        ];
      case "1":
        return [
          "https://unicoukraine.com/products/jam-lip-gloss-with-menthol",
          "https://unicoukraine.com/products/icon-multitasker"
        ];
      case "2":
        return [
          "https://unicoukraine.com/products/lip-gloss-with-menthol-bestie",
          "https://unicoukraine.com/products/leader-multitasker"
        ];
      case "3":
        return [
          "https://unicoukraine.com/products/amour",
          "https://unicoukraine.com/products/sunset-multitasker"
        ];
      default:
        return null;
    }
  };

  const getPalette = (code: string | number | null): string[] => {
    const value = String(code);
    switch (value) {
      case "0":
        return ["#a8af85", "#8a9634", "#eb6725", "#ffd042", "#9d4a2b", "#c23623", "#a38b68"];
      case "1":
        return ["#96d3db", "#9a8ebe", "#f1708c", "#c9737d", "#7fa5d5", "#32837d", "#6b6d6e"];
      case "2":
        return ["#57176c", "#ac0371", "#d20664", "#071675", "#0a5b8f", "#219f7d", "#fcf314"];
      case "3":
        return ["#fcc7c5", "#fc978b", "#94d6da", "#ad7e56", "#722d1a", "#fec650", "#b4da9c"
      ];
      default:
        return [];
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleAnalyze = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(String(data.result));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const links = getRecommendationLinks(result);
  const palette = getPalette(result);

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Seasons of You</h1>
      </header>

      <div className="homepage-content">
        <div className="content-wrapper">
          <div className="upload-card">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-placeholder">
                <FontAwesomeIcon icon={faCameraRetro} />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="file-input"
            />

            <button onClick={handleUploadClick} className="btn">
              Choose Image
            </button>

            {previewUrl && (
              <button onClick={handleAnalyze} disabled={loading} className="btn">
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            )}

            {result && (
              <div className="result">
                Your colortype: <b>{getColortypeLabel(result)}</b>
              </div>
            )}

            {error && <div className="error">Error: {error}</div>}
          </div>

          {result && links && (
            <div className="recommendation-block">
              <div className="recommendation-image">
                <a href={links[0]} target="_blank" rel="noopener noreferrer">
                  <img src="/recommendation1.png" alt="Recommendation 1" />
                </a>
              </div>
              <div className="recommendation-image">
                <a href={links[1]} target="_blank" rel="noopener noreferrer">
                  <img src="/recommendation2.png" alt="Recommendation 2" />
                </a>
              </div>
            </div>
          )}
        </div>

        {palette.length > 0 && (
          <div className="color-palette-bottom">
            {palette.map((color, i) => (
              <div
                key={i}
                className="color-block"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
