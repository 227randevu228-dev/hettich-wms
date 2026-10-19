<input 
  type="email" 
  placeholder="Email"
  autoComplete="off"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input 
  type="password" 
  placeholder="Пароль"
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
