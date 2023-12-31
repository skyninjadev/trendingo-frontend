import { useParams } from 'react-router'
import { Fragment, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { grey } from '@mui/material/colors'
import Flag from 'react-world-flags'
import parse from 'html-react-parser'
import { COLOR_PRIMARY, URL_TELEGRAM_ADMIN_1, URL_TELEGRAM_ADMIN_2 } from '../../utils/constants'
import { IMAGES, SELECTS, TRENDING_SERVICES } from '../../utils/data'
import useOrders from '../../hooks/useOrders'
import DialogDexToolsOrder from './DialogDexToolsOrder'
import DialogPoocoinOrder from './DialogPoocoinOrder'
import DialogPinksaleOrder from './DialogPinksaleOrder'
import DialogOrder from './DialogOrder'

export default function TrendingService() {
  const { serviceName } = useParams()
  const theme = useTheme()
  const { cart, addOrderItemToCart } = useOrders()

  const [trendingType, setTrendingType] = useState('')
  const [period, setPeriod] = useState(0)
  const [region, setRegion] = useState('')
  const [chain, setChain] = useState('')
  const [dialogOpened, setDialogOpened] = useState(false)

  const serviceData = useMemo(() => {
    let service = TRENDING_SERVICES.find(
      element => element.name === serviceName
    )
    return service
  }, [serviceName])

  const imageUrl = useMemo(() => {
    if (serviceData) {
      let imageData = IMAGES.find(element => element.id === serviceData.imageId)
      return imageData?.value
    }
  }, [serviceData?.imageId])

  const regionSelect = useMemo(() => {
    if (trendingType === 'trending_region') {
      return SELECTS.find(element => element.id === 4)
    }
  }, [trendingType])

  const price = useMemo(() => {
    if (serviceData) {
      let priceData = null;
      if (period && trendingType) {
        priceData = serviceData.prices.find(
          priceItem => priceItem.trendingType === trendingType && priceItem.period === period
        )

        if (priceData) {
          return priceData.price
        }
      } else if (period && !trendingType) {

        if (chain) {
          priceData = serviceData.prices.find(
            priceItem => priceItem.period === period && priceItem.chain === chain
          )

          if (priceData) {
            return priceData.price
          }
        } else {
          priceData = serviceData.prices.find(priceItem => priceItem.period === period)

          if (priceData) {
            return priceData.price
          }
        }
      }
    }

  }, [period, trendingType])

  const disableOrder = useMemo(() => {
    if (!price) {
      return true
    }
    if (cart) {
      let orderExisted = cart.find(orderItem => orderItem.service_title === serviceData?.title)
      if (orderExisted) {
        return true
      }
    }
    return false
  }, [cart, price])

  const handleClose = () => {
    setDialogOpened(false);
  };

  const handleChangeSelect = (selectId: number, value: string) => {
    console.log('>>>>>> selectId > ', selectId)
    if (selectId === 1 || selectId === 5 || selectId === 7) {
      setTrendingType(value)
    } else if (selectId === 2 || selectId === 3) {
      setPeriod(Number(value))
    } else if (selectId === 4) {
      setRegion(value)
    } else if (selectId === 6) {
      setChain(value)
    }
  }

  return (
    <Box>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 6, md: 12 }}>
          <Box>
            <Grid container spacing={{ xs: 6, md: 0 }}>
              {/* Image */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" justifyContent={{ xs: "center", md: 'start' }}>
                  {
                    imageUrl && (
                      <Paper
                        component="img"
                        src={imageUrl}
                        alt=""
                        elevation={24}
                        sx={{ width: { xs: '90%', sm: '70%', md: '80%' } }}
                      />
                    )
                  }

                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* Title */}
                <Typography
                  color={COLOR_PRIMARY}
                  variant="h4"
                  fontWeight={800}
                  textAlign={{ xs: 'center', sm: 'left' }}
                >
                  {serviceData?.title}
                </Typography>

                {/* Decription */}
                {
                  serviceData?.description && (
                    <Box mt={3}>
                      <Typography
                        variant="body1"
                        textAlign="justify"
                        color={grey[400]}
                        sx={{
                          '& a': {
                            textDecoration: 'none',
                            color: theme.palette.primary.main
                          }
                        }}
                        lineHeight={2}
                      >
                        {parse(serviceData.description)}
                      </Typography>
                    </Box>
                  )
                }

                <Box mt={3}>
                  <Typography
                    variant="body1"
                    textAlign="justify"
                    color={grey[400]}
                    fontWeight={700}
                  >
                    Do you have any questions before ordering?
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="justify"
                    color={grey[400]}
                    sx={{
                      '& a': {
                        textDecoration: 'none',
                        color: theme.palette.primary.main
                      }
                    }}
                    lineHeight={2}
                  >
                    Contact <Link target="_blank" href={URL_TELEGRAM_ADMIN_1}>@sagarnaik1</Link> or <Link target="_blank" href={URL_TELEGRAM_ADMIN_2}>@GibonDEXT</Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Card sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4}>
                {
                  serviceData?.selectIds && (
                    <>
                      {
                        serviceData.selectIds.map(id => {
                          let selectData = SELECTS.find(element => element.id === id);
                          if (selectData) {
                            return (
                              <TextField
                                select
                                label={selectData.label}
                                sx={{ width: '25ch' }}
                                key={id}
                                onChange={(e) => handleChangeSelect(id, e?.target?.value)}
                              >
                                {
                                  selectData.options.map(optionItem => (
                                    <MenuItem value={optionItem.value} key={optionItem.value}>
                                      {optionItem.label}
                                    </MenuItem>
                                  ))
                                }
                              </TextField>
                            )
                          }
                          return <Fragment key={id} />
                        })
                      }
                    </>
                  )
                }
                {
                  regionSelect && (
                    <TextField
                      select
                      name="region"
                      label={regionSelect.label}
                      sx={{
                        width: '28ch',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                        }
                      }}
                      onChange={(e) => handleChangeSelect(regionSelect.id, e?.target?.value)}
                    >
                      {
                        regionSelect.options.map(optionItem => (
                          <MenuItem value={optionItem.value} key={optionItem.value}>
                            {
                              typeof optionItem.value === 'string' && (
                                <ListItemIcon sx={{ width: 40, mr: 2, height: 20 }}>
                                  <Flag code={optionItem.value} />
                                </ListItemIcon>
                              )
                            }
                            <ListItemText>
                              {optionItem.label}
                            </ListItemText>
                          </MenuItem>
                        ))
                      }
                    </TextField>
                  )
                }
              </Stack>

              {
                price && (
                  <Typography variant="h5" color="white">
                    {price} $
                  </Typography>
                )
              }

              <Button variant="contained" onClick={() => setDialogOpened(true)} disabled={disableOrder}>
                Order
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
      {
        (() => {
          if (serviceData && price) {
            switch (serviceData.id) {
              case 5:
                return <DialogDexToolsOrder
                  isOpened={dialogOpened}
                  handleClose={handleClose}
                  orderData={{
                    service_type: 'trending',
                    service_title: serviceData.title,
                    chain,
                    period: `${period} day${period > 1 && 's'}`,
                    price
                  }}
                />
              case 6:
                return <DialogPoocoinOrder
                  isOpened={dialogOpened}
                  handleClose={handleClose}
                  orderData={{
                    service_type: 'trending',
                    service_title: serviceData.title,
                    trending_type: trendingType,
                    period: `${period} day${period > 1 && 's'}`,
                    price
                  }}
                />
              case 7:
                return <DialogPinksaleOrder
                  isOpened={dialogOpened}
                  handleClose={handleClose}
                  orderData={{
                    service_type: 'trending',
                    service_title: serviceData.title,
                    period: `${period} day${period > 1 && 's'}`,
                    price
                  }}
                />
              default:
                return <DialogOrder
                  isOpened={dialogOpened}
                  handleClose={handleClose}
                  serviceDataId={serviceData.id}
                  orderData={{
                    service_type: 'trending',
                    service_title: serviceData.title,
                    trending_type: trendingType,
                    period: `${period} day${period > 1 && 's'}`,
                    price
                  }}
                />
            }
          }
          return <></>
        })()
      }
    </Box>
  )
}