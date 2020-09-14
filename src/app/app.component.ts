import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  readonly url: string = 'https://pokeapi.co/api/v2';

  public pokemons: [any];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pokeAPI();
  }

  private pokeAPI(): void {
    this.http.get<any>(`${this.url}/pokedex/2/`)
      .toPromise()
      .then(data => this.formatterArray(data))
      .then(data => this.getDetails(data))
      .then(data => this.getCorlor(data))
      .then(data => {
        this.pokemons = data;
      })
  }

  private async getCorlor(arrayOfPokemons) {
    try {
      const urls = [];

      arrayOfPokemons.map(({ entry_number }) => urls.push(`${this.url}/pokemon-species/${entry_number}/`));

      for (const [idx, url] of urls.entries()) {
        const { color: { name }} = await this.http.get<any>(url).toPromise();

        arrayOfPokemons[idx].color = name;
      }

      return arrayOfPokemons;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getDetails(arrayOfPokemons) {
    try {
      const urls = [];
      const newArrayOfPokemons = arrayOfPokemons.slice(0, 25);

      newArrayOfPokemons.map(({ entry_number }) => urls.push(`${this.url}/pokemon/${entry_number}/`));

      for (const [idx, url] of urls.entries()) {
        newArrayOfPokemons[idx].types = [];

        const { types } = await this.http.get<any>(url).toPromise();

        types.map(({ type: { name }}) => newArrayOfPokemons[idx].types.push(name));
      }

      return newArrayOfPokemons;
    } catch (error) {
      throw new Error(error);
    }
  }

  private formatterArray({ pokemon_entries }) {
    return pokemon_entries.map(({ entry_number, pokemon_species: { name }}) => ({
      name,
      entry_number,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry_number}.png`
    }));
  }
}
