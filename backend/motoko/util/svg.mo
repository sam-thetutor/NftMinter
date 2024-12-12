import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";

module {
  public type SVGData = {
    shape: Text;
    width: Nat;
    height: Nat;
    color: Text;
    text: ?Text;
  };

  public func make(dataBytes: [Nat8]): Text {
    // Decoding byte array to text, assuming UTF-8 encoding
    let dataText = Text.decodeUtf8(Blob.fromArray(dataBytes));
    // Simple parsing logic (you might need a JSON parser or similar depending on your data format)
    let parsedData = parseData(dataText);

    // SVG header with specified width and height
    let svgOpen = "<svg xmlns='http://www.w3.org/2000/svg' width='" # Nat.toText(parsedData.width) # "' height='" # Nat.toText(parsedData.height) # "'>";
    
    // Generating the SVG body based on the shape type
    let svgBody = switch (parsedData.shape) {
      case ("rectangle") {
        "<rect width='100%' height='100%' fill='" # parsedData.color # "'/>";
      };
        
      case ("circle") {
        "<circle cx='" # Nat.toText(parsedData.width / 2) # "' cy='" # Nat.toText(parsedData.height / 2) # "' r='" # Nat.toText(parsedData.width / 4) # "' fill='" # parsedData.color # "'/>";
      };
        
      // Default case if shape is not recognized
      case (_) {
        "<rect width='100%' height='100%' fill='none'/>"; // Invisible shape
      }
        
    };
    
    // Optional text centered in the SVG
    let svgText = switch (parsedData.text) {
      case (?txt) {
        "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='black'>" # txt # "</text>";
      };
        
      case (null) {
        ""; // No text if not specified
      }
        
    };

    let svgClose = "</svg>";
    // Concatenating all parts to form the complete SVG
    return svgOpen # svgBody # svgText # svgClose;
  };

  private func parseData(dataText: Text): ?SVGData {
    let parts = Text.split(dataText, {#char(','), #text(","), #predicate(func(c: Char): Bool { c == ',' })});
    if (Array.size(parts) < 4) {
      // Not enough data to parse
      return null;
    } else {
      // Parsing each part of the string
      let shape = parts[0];
      let width = Text.toNat(parts[1]);
      let height = Text.toNat(parts[2]);
      let color = parts[3];
      let text = if (Array.size(parts) > 4) ?parts[4] else null;

      // Creating the SVGData object
      switch (width, height) {
        case (?w, ?h) {
            {
            shape = shape;
            width = w;
            height = h;
            color = color;
            text = text;
          };
        };
          
        case (_) {
            null; // Return null if width or height are not valid numbers
        }          
      }
    }
  };
};
