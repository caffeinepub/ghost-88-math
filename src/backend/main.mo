import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";

actor {
  type Game = {
    id : Nat;
    name : Text;
    url : Text;
    category : Text;
    description : Text;
  };

  module Game {
    public func compare(game1 : Game, game2 : Game) : Order.Order {
      Text.compare(game1.name, game2.name);
    };
  };

  var nextId = 1;

  let games = Map.empty<Nat, Game>();

  public shared ({ caller }) func addGame(name : Text, url : Text, category : Text, description : Text) : async Nat {
    let game : Game = {
      id = nextId;
      name;
      url;
      category;
      description;
    };
    games.add(nextId, game);
    nextId += 1;
    game.id;
  };

  public query ({ caller }) func getGame(id : Nat) : async ?Game {
    games.get(id);
  };

  public query ({ caller }) func getAllGames() : async [Game] {
    games.values().toArray().sort();
  };

  public query ({ caller }) func getGamesByCategory(category : Text) : async [Game] {
    let filteredGames = games.values().filter(
      func(game) {
        game.category.contains(#text category);
      }
    );
    filteredGames.toArray();
  };
};
